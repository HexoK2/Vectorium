/* =============================================================================
   drag.js — attraper et déplacer les points, à la souris comme au doigt.
   GÉNÉRIQUE : ce fichier reçoit une liste de points, il ne sait pas ce qu'ils
   représentent.

   Un seul jeu d'événements pour tout le monde : les Pointer Events
   (pointerdown / pointermove / pointerup) couvrent souris, doigt et stylet.
   Écrire des écouteurs mousedown ET touchstart en parallèle, c'est deux fois
   le code et deux fois les bugs.

   Trois pièges, tous traités ici :
   1. touch-action: none en CSS (voir vectorium.css) — sans lui le navigateur
      mobile prend le glissement pour un défilement de page et n'envoie jamais
      les pointermove.
   2. setPointerCapture — le glissement continue même quand le doigt sort du
      canvas, et le pointerup arrive à coup sûr.
   3. La zone d'accroche se mesure en PIXELS ÉCRAN, pas en unités monde : un
      doigt fait toujours la même taille physique, quelle que soit l'échelle.
   ========================================================================== */

export function activerDrag(canvas, repere, { points, onChange }) {
  // Un doigt est moins précis qu'un curseur : on lui donne une cible plus large.
  const RAYON_SOURIS = 16
  const RAYON_DOIGT = 26

  const etat = { actif: null, survole: null }

  // Cherche le point manipulable le plus proche de la position du pointeur,
  // dans la limite du rayon d'accroche. On compare bien en pixels écran.
  function pointLePlusProche(evt, rayon) {
    const rect = canvas.getBoundingClientRect()
    const souris = { x: evt.clientX - rect.left, y: evt.clientY - rect.top }

    let trouve = null
    let distanceMin = Infinity

    for (const p of points) {
      if (p.fixe) continue
      const e = repere.versEcran(p)
      const d = Math.hypot(e.x - souris.x, e.y - souris.y)
      if (d <= rayon && d < distanceMin) {
        distanceMin = d
        trouve = p
      }
    }
    return trouve
  }

  function rayonPour(evt) {
    return evt.pointerType === 'touch' ? RAYON_DOIGT : RAYON_SOURIS
  }

  canvas.addEventListener('pointerdown', (evt) => {
    const cible = pointLePlusProche(evt, rayonPour(evt))
    if (!cible) return

    etat.actif = cible
    etat.survole = cible
    canvas.setPointerCapture(evt.pointerId)
    canvas.style.cursor = 'grabbing'
    evt.preventDefault()
    onChange()
  })

  canvas.addEventListener('pointermove', (evt) => {
    if (etat.actif) {
      // Le point suit exactement le pointeur, converti en coordonnées monde.
      const pos = repere.positionPointeur(evt)
      etat.actif.x = pos.x
      etat.actif.y = pos.y
      onChange()
      return
    }

    // Pas de glissement en cours : on met juste à jour le survol, ce qui sert
    // au curseur et au halo. Inutile sur mobile, où il n'y a pas de survol.
    if (evt.pointerType === 'mouse') {
      const sousLeCurseur = pointLePlusProche(evt, RAYON_SOURIS)
      if (sousLeCurseur !== etat.survole) {
        etat.survole = sousLeCurseur
        canvas.style.cursor = sousLeCurseur ? 'grab' : 'default'
        onChange()
      }
    }
  })

  function relacher(evt) {
    if (!etat.actif) return
    etat.actif = null
    canvas.style.cursor = etat.survole ? 'grab' : 'default'
    if (canvas.hasPointerCapture(evt.pointerId)) canvas.releasePointerCapture(evt.pointerId)
    onChange()
  }

  // pointercancel arrive quand le système reprend la main (appel entrant,
  // geste de l'OS). Sans lui, le point resterait collé au doigt pour toujours.
  canvas.addEventListener('pointerup', relacher)
  canvas.addEventListener('pointercancel', relacher)

  canvas.addEventListener('pointerleave', () => {
    if (etat.actif) return
    etat.survole = null
    canvas.style.cursor = 'default'
    onChange()
  })

  return etat
}
