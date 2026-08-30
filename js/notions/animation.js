/* =============================================================================
   animation.js — fait tourner une boucle requestAnimationFrame générique sur
   le handle { points, rendre } retourné par monterModule(). Généralise le
   pattern déjà utilisé par demo-chargement.js (animation automatique au
   chargement) pour n'importe quelle notion qui a besoin d'un mouvement dans
   le temps, déclenché par une interaction (clic, etc.).

   Générique au sens où il ne connaît aucune notion : il reçoit une fonction
   etape(t) fournie par l'appelant, qui décide seule de ce qui bouge (points
   existants, ou propriétés custom ajoutées dessus par la notion). Vit dans
   js/notions/ (pas js/moteur/) pour la même raison que demo-chargement.js :
   utilisé depuis les pages, pas depuis le moteur lui-même.
   ========================================================================== */

export function demarrerAnimation({ rendre }, etape, { duree = null, condition = null } = {}) {
  let debut = null
  let actif = true
  let idAnimation = null

  function frame(temps) {
    if (!actif) return
    if (debut === null) debut = temps
    const t = temps - debut

    etape(t)
    rendre()

    const dureeAtteinte = duree !== null && t >= duree
    const conditionRemplie = condition !== null && condition(t)

    if (dureeAtteinte || conditionRemplie) {
      actif = false
      return
    }

    idAnimation = requestAnimationFrame(frame)
  }

  function arreter() {
    if (!actif) return
    actif = false
    if (idAnimation !== null) cancelAnimationFrame(idAnimation)
  }

  idAnimation = requestAnimationFrame(frame)

  return { arreter }
}
