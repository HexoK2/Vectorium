/* =============================================================================
   produit-scalaire.js — LA NOTION. Spécifique, et seule à l'être.
   Ce fichier ne dessine rien lui-même : il demande au moteur de dessiner.

   L'idée pédagogique : le produit scalaire mesure « à quel point A et B vont
   dans la même direction, pondéré par leurs longueurs ». La formule
   ax*bx + ay*by ne le dit pas. Deux choses le disent :

   - la PROJECTION de A sur la droite portée par B (le trait pointillé) :
     A · B, c'est la longueur de cette projection multipliée par ‖B‖ ;
   - le SIGNE : positif quand l'angle est aigu, nul à 90°, négatif au-delà.

   D'où le code couleur : vert quand les vecteurs pointent dans le même sens,
   rouge quand ils s'opposent, gris à la perpendiculaire.
   ========================================================================== */

// Couleurs d'identité des deux vecteurs : elles ne changent jamais, c'est ce
// qui permet de les distinguer. Seules les couleurs du RÉSULTAT varient.
const COULEUR_A = '#60a5fa'
const COULEUR_B = '#f472b6'

// cos vaut -1 (opposés) à +1 (alignés). On le transforme en teinte HSL :
// 0 = rouge, 120 = vert. La saturation tombe près de la perpendiculaire pour
// que « ni l'un ni l'autre » se lise comme du gris plutôt que comme un jaune
// franc, qui donnerait l'impression d'une valeur remarquable.
function couleurSelonCos(cos, opacite = 1) {
  const teinte = 120 * (cos + 1) / 2
  const saturation = 30 + 55 * Math.abs(cos)
  return `hsl(${teinte.toFixed(0)} ${saturation.toFixed(0)}% 62% / ${opacite})`
}

export const produitScalaire = {
  id: 'produit-scalaire',
  titre: 'Produit scalaire',

  repere: { echelle: 46 },

  points: [
    { id: 'a', x: 3.2, y: 1.4, couleur: COULEUR_A, label: 'A' },
    { id: 'b', x: 1.6, y: 2.6, couleur: COULEUR_B, label: 'B' },
  ],

  /* --- 1) Les maths. Aucun canvas, aucun DOM : appelable dans la console. --- */
  calculer([a, b]) {
    const dot = a.x * b.x + a.y * b.y

    const normeA = Math.hypot(a.x, a.y)
    const normeB = Math.hypot(b.x, b.y)

    // Le produit vectoriel en 2D (un seul nombre) sert ici uniquement à donner
    // un SIGNE à l'angle : positif si A est à gauche de B, négatif à droite.
    // Sans lui, acos(cos) renverrait toujours un angle positif et l'arc
    // sauterait d'un côté à l'autre quand on croise l'axe.
    const croix = b.x * a.y - b.y * a.x

    // Garde-fou : si un vecteur est nul, cos n'est pas défini (division par 0).
    const denominateur = normeA * normeB
    const cos = denominateur > 1e-9 ? dot / denominateur : 0
    const angle = denominateur > 1e-9 ? Math.atan2(croix, dot) : 0

    // Projection de A sur la droite portée par B : le facteur t est celui qui
    // rend (A - tB) perpendiculaire à B. C'est le trait pointillé du dessin.
    const t = normeB > 1e-9 ? dot / (normeB * normeB) : 0

    return {
      dot,
      normeA,
      normeB,
      cos,
      angle,                              // en radians, signé
      angleDeg: angle * 180 / Math.PI,
      projection: { x: b.x * t, y: b.y * t },
      couleur: couleurSelonCos(cos),
      couleurBande: couleurSelonCos(cos, 0.5),
    }
  },

  /* --- 2) Le dessin. Uniquement des primitives du moteur. ------------------ */
  dessiner(d, [a, b], v) {
    const origine = { x: 0, y: 0 }

    // La projection de A sur B, en pointillés : c'est LE trait qui fait
    // comprendre la notion. On le dessine en premier pour qu'il passe sous
    // les flèches.
    if (v.normeB > 1e-9 && v.normeA > 1e-9) {
      // Bande large et semi-transparente : elle se superpose au vecteur B
      // puisque la projection est, par définition, portée par B. C'est
      // exactement ce qu'on veut montrer — « voilà quelle part de B est
      // couverte par A ».
      d.segment(origine, v.projection, { couleur: v.couleurBande, epaisseur: 10 })
      d.segment(a, v.projection, { couleur: v.couleur, epaisseur: 1.5, pointilles: [4, 5] })

      // L'arc de l'angle, du vecteur B vers le vecteur A. Rayon en pixels,
      // borné pour ne pas dépasser le plus court des deux vecteurs.
      const angleB = Math.atan2(b.y, b.x)
      const rayonPx = Math.min(46, Math.min(v.normeA, v.normeB) * d.repere.echelle * 0.5)
      d.arc(origine, rayonPx, angleB, angleB + v.angle, { couleur: v.couleur, epaisseur: 2 })
    }

    d.fleche(origine, a, { couleur: COULEUR_A })
    d.fleche(origine, b, { couleur: COULEUR_B })
  },

  /* --- 3) Les valeurs affichées à côté du canvas. -------------------------- */
  lecture(v) {
    let interpretation
    if (v.cos > 0.97) interpretation = 'quasiment la même direction'
    else if (v.cos > 0.08) interpretation = 'même direction générale'
    else if (v.cos > -0.08) interpretation = 'perpendiculaires'
    else if (v.cos > -0.97) interpretation = 'directions opposées'
    else interpretation = 'exactement opposés'

    return [
      { label: 'A · B', valeur: v.dot.toFixed(2), couleur: v.couleur },
      { label: 'angle', valeur: `${Math.abs(v.angleDeg).toFixed(0)}°` },
      { label: 'cos', valeur: v.cos.toFixed(2) },
      { label: '‖A‖', valeur: v.normeA.toFixed(2) },
      { label: '‖B‖', valeur: v.normeB.toFixed(2) },
      { label: '', valeur: interpretation, couleur: v.couleur },
    ]
  },
}
