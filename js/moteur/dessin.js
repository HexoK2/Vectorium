/* =============================================================================
   dessin.js — les primitives de dessin.
   GÉNÉRIQUE : aucune notion n'est nommée ici. Le moteur sait tracer une flèche,
   un segment, un point, un arc et du texte — il ne sait pas ce qu'ils veulent
   dire.

   Toutes les fonctions prennent des coordonnées MONDE et convertissent
   elles-mêmes. Une notion n'appelle jamais versEcran().

   Règle importante : ce qui décrit une GRANDEUR MATHÉMATIQUE est en unités
   monde (la longueur d'un vecteur), ce qui décrit une DÉCORATION est en pixels
   (l'épaisseur d'un trait, la taille d'une pointe de flèche, le rayon d'un
   point). Sinon la pointe de flèche grossit quand on augmente l'échelle et
   devient ridicule.
   ========================================================================== */

export function creerDessin(repere) {
  const ctx = repere.ctx

  /* --- Flèche ---------------------------------------------------------------
     Le trait s'arrête à la base de la pointe plutôt qu'au sommet : sinon
     l'extrémité arrondie du trait dépasse et bave hors du triangle.
     Le vecteur unitaire (ux, uy) donne la direction ; (-uy, ux) est sa
     perpendiculaire, ce qui suffit à placer les deux ailes de la pointe.

     Le paramètre glow ajoute une ombre floue autour de la flèche pour une
     meilleure visibilité sur les fonds sombres.
  --------------------------------------------------------------------------- */
  function fleche(depuis, vers, { couleur = '#fff', epaisseur = 3, tete = 12, glow = null } = {}) {
    const a = repere.versEcran(depuis)
    const b = repere.versEcran(vers)
    const dx = b.x - a.x
    const dy = b.y - a.y
    const longueur = Math.hypot(dx, dy)

    // Vecteur trop court pour être dessiné : on ne trace rien plutôt que de
    // diviser par zéro et produire des NaN.
    if (longueur < 1) return

    const ux = dx / longueur
    const uy = dy / longueur
    const t = Math.min(tete, longueur * 0.5)   // pointe jamais plus longue que le vecteur

    ctx.save()
    if (glow) {
      ctx.shadowColor = glow
      ctx.shadowBlur = 14
    }

    ctx.strokeStyle = couleur
    ctx.lineWidth = epaisseur
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x - ux * t * 0.85, b.y - uy * t * 0.85)
    ctx.stroke()

    const px = -uy
    const py = ux
    ctx.fillStyle = couleur
    ctx.beginPath()
    ctx.moveTo(b.x, b.y)
    ctx.lineTo(b.x - ux * t + px * t * 0.45, b.y - uy * t + py * t * 0.45)
    ctx.lineTo(b.x - ux * t - px * t * 0.45, b.y - uy * t - py * t * 0.45)
    ctx.closePath()
    ctx.fill()

    // Petit point à la pointe de la flèche avec glow
    if (glow) {
      ctx.beginPath()
      ctx.arc(b.x, b.y, 8, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /* --- Segment (droit ou pointillé) ---------------------------------------- */
  function segment(depuis, vers, { couleur = '#fff', epaisseur = 2, pointilles = null } = {}) {
    const a = repere.versEcran(depuis)
    const b = repere.versEcran(vers)

    ctx.save()
    if (pointilles) ctx.setLineDash(pointilles)
    ctx.strokeStyle = couleur
    ctx.lineWidth = epaisseur
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
    ctx.restore()   // restore() annule le setLineDash sans avoir à le remettre à []
  }

  /* --- Point manipulable ---------------------------------------------------
     Le halo n'est pas décoratif : c'est le retour visuel qui dit « ce point
     réagit ». Sans lui, l'utilisateur ne sait pas qu'il peut attraper quoi que
     ce soit — et le premier reproche des testeurs sera toujours celui-là.
  --------------------------------------------------------------------------- */
  function point(p, { couleur = '#fff', rayon = 7, actif = false } = {}) {
    const e = repere.versEcran(p)

    if (actif) {
      ctx.fillStyle = couleur
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      ctx.arc(e.x, e.y, rayon + 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    ctx.fillStyle = couleur
    ctx.beginPath()
    ctx.arc(e.x, e.y, rayon, 0, Math.PI * 2)
    ctx.fill()
  }

  /* --- Arc d'angle ---------------------------------------------------------
     Les angles reçus sont en convention MATHS : mesurés depuis l'axe des x,
     croissants dans le sens trigonométrique (antihoraire).

     Le canvas, lui, a son axe y vers le bas : un angle croissant y tourne
     visuellement dans le sens horaire. D'où les deux ajustements : on passe
     -angle au canvas, et on inverse le drapeau de sens de rotation.

     Le rayon est en PIXELS : l'arc marque un angle, pas une distance.
  --------------------------------------------------------------------------- */
  function arc(centre, rayonPx, angleDebut, angleFin, { couleur = '#fff', epaisseur = 2 } = {}) {
    const c = repere.versEcran(centre)
    ctx.strokeStyle = couleur
    ctx.lineWidth = epaisseur
    ctx.beginPath()
    ctx.arc(c.x, c.y, rayonPx, -angleDebut, -angleFin, angleFin > angleDebut)
    ctx.stroke()
  }

  /* --- Texte ---------------------------------------------------------------
     decalage est en pixels : une étiquette doit rester à la même distance
     visuelle de son point quelle que soit l'échelle.
  --------------------------------------------------------------------------- */
  function texte(p, contenu, {
    couleur = '#fff',
    taille = 13,
    gras = false,
    decalage = { x: 0, y: 0 },
    align = 'center',
    baseline = 'middle',
  } = {}) {
    const e = repere.versEcran(p)
    ctx.fillStyle = couleur
    ctx.font = `${gras ? '600 ' : ''}${taille}px system-ui, sans-serif`
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(contenu, e.x + decalage.x, e.y + decalage.y)
  }

  return { fleche, segment, point, arc, texte, repere, ctx }
}
