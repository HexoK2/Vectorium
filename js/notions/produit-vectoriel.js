/* =============================================================================
   produit-vectoriel.js — LA NOTION.
   Mesure l'aire du parallélogramme formé par deux vecteurs, avec signe.
   ========================================================================== */

import { POINTILLES_FANTOME, OPACITE_FANTOME } from './univers.js'

const COULEUR_A = '#4fd1c5'
const GLOW_A    = 'rgba(79, 209, 197, 0.35)'
const FANTOME_A = `rgba(79, 209, 197, ${OPACITE_FANTOME})`
const COULEUR_B = '#ff6b9d'
const GLOW_B    = 'rgba(255, 107, 157, 0.35)'
const FANTOME_B = `rgba(255, 107, 157, ${OPACITE_FANTOME})`

const VERT  = '#59d97a'
const ROUGE = '#ff5c5c'
const GRIS  = '#d8dee8'

// En dessous de ce déplacement, la différence est du bruit de manipulation,
// pas une intention : on ne montre rien.
const SEUIL_DEPLACEMENT = 0.05

export const produitVectoriel = {
  id: 'produit-vectoriel',
  titre: 'Produit vectoriel',

  repere: { echelle: 42, graduations: false },

  points: [
    { id: 'a', x:  2.4, y: -1.6, couleur: COULEUR_A },
    { id: 'b', x: -1.2, y: -2.0, couleur: COULEUR_B },
  ],

  calculer([a, b]) {
    const cross = a.x * b.y - a.y * b.x

    let couleur = GRIS
    let verdict = 'Perpendiculaires — surface maximale.'
    if (Math.abs(cross) < 0.1) {
      couleur = GRIS
      verdict = 'Zéro (ou presque) : colinéaires — pas de surface, pas de rotation.'
    } else if (cross > 0.1) {
      couleur = VERT
      verdict = 'Positif : B est à gauche de A (rotation antihoraire).'
    } else if (cross < -0.1) {
      couleur = ROUGE
      verdict = 'Négatif : B est à droite de A (rotation horaire).'
    }

    return { cross, couleur, verdict }
  },

  dessiner(d, [a, b]) {
    const origine = { x: 0, y: 0 }

    // Le fantôme : position de départ si un point a bougé au-delà du seuil.
    for (const [actuel, depart, couleurFantome] of [
      [a, this.points[0], FANTOME_A],
      [b, this.points[1], FANTOME_B],
    ]) {
      const deplacement = Math.hypot(actuel.x - depart.x, actuel.y - depart.y)
      if (deplacement > SEUIL_DEPLACEMENT) {
        d.segment(depart, actuel, { couleur: couleurFantome, pointilles: POINTILLES_FANTOME })
      }
    }

    // Dessiner le parallélogramme (l'aire visuelle de la notion)
    const p3 = { x: a.x + b.x, y: a.y + b.y }
    d.parallelogramme(origine, a, p3, b, { couleur: 'rgba(100, 150, 200, 0.2)' })

    // Puis les vecteurs par-dessus
    d.fleche(origine, a, { couleur: COULEUR_A, glow: GLOW_A })
    d.fleche(origine, b, { couleur: COULEUR_B, glow: GLOW_B })
  },

  lecture(v, [a, b]) {
    const n = (x) => x.toFixed(2)
    return {
      result: { label: 'A × B =', value: n(v.cross), color: v.couleur },
      formula:
        `A × B = (<span class="va">${n(a.x)}</span> × <span class="vb">${n(b.y)}</span>) − ` +
        `(<span class="va">${n(a.y)}</span> × <span class="vb">${n(b.x)}</span>) ` +
        `= <b style="color:${v.couleur}">${n(v.cross)}</b>`,
      verdict: v.verdict,
    }
  },
}
