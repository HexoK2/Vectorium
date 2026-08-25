/* =============================================================================
   matrices.js — LA NOTION (test).
   Applique une rotation puis une mise à l'échelle à un vecteur A, et montre
   le résultat A'. Deux curseurs, comme interpolation-lineaire.js.
   ========================================================================== */

import { POINTILLES_FANTOME, OPACITE_FANTOME } from './univers.js'

const COULEUR_A = '#4fd1c5'
const GLOW_A    = 'rgba(79, 209, 197, 0.35)'
const FANTOME_A = `rgba(79, 209, 197, ${OPACITE_FANTOME})`
const COULEUR_B = '#ff6b9d'
const GLOW_B    = 'rgba(255, 107, 157, 0.35)'

// En dessous de ce déplacement, la différence est du bruit de manipulation,
// pas une intention : on ne montre rien.
const SEUIL_DEPLACEMENT = 0.05

export const matrices = {
  id: 'matrices',
  titre: 'Matrices — rotation et échelle',

  repere: { echelle: 42, graduations: false },

  points: [
    { id: 'a', x: 2.4, y: 0.8, couleur: COULEUR_A },
  ],

  curseurs: [
    { id: 'angle', min: -180, max: 180, pas: 1, defaut: 45, label: 'angle (°)' },
    { id: 'echelle', min: 0.25, max: 2.5, pas: 0.05, defaut: 1.5, label: 'échelle' },
  ],

  calculer([a], { angle, echelle }) {
    const rad = angle * Math.PI / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    // Rotation d'abord, puis mise à l'échelle du résultat.
    const bx = (a.x * cos - a.y * sin) * echelle
    const by = (a.x * sin + a.y * cos) * echelle

    return { b: { x: bx, y: by }, angle, echelle }
  },

  dessiner(d, [a], val) {
    const origine = { x: 0, y: 0 }

    // Le fantôme : position de départ si A a bougé au-delà du seuil.
    const depart = this.points[0]
    const deplacement = Math.hypot(a.x - depart.x, a.y - depart.y)
    if (deplacement > SEUIL_DEPLACEMENT) {
      d.segment(depart, a, { couleur: FANTOME_A, pointilles: POINTILLES_FANTOME })
    }

    d.fleche(origine, a, { couleur: COULEUR_A, glow: GLOW_A })
    d.fleche(origine, val.b, { couleur: COULEUR_B, glow: GLOW_B })
  },

  lecture(val, [a]) {
    const n = (x) => x.toFixed(2)
    return {
      result: { label: "A' =", value: `(${n(val.b.x)}, ${n(val.b.y)})`, color: COULEUR_B },
      formula:
        `A' = Rotation(<span class="va">${val.angle}°</span>) × Échelle(<span class="vb">${val.echelle.toFixed(2)}</span>) × A`,
      verdict: `A mesure ${Math.hypot(a.x, a.y).toFixed(2)} unités. Après transformation, A' en mesure ${Math.hypot(val.b.x, val.b.y).toFixed(2)}.`,
    }
  },
}
