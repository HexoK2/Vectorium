/* =============================================================================
   interpolation-lineaire.js — LA NOTION.
   Calcule un point P qui glisse de A vers B selon un paramètre t (0 à 1).
   Premier usage du cinquième champ optionnel du contrat : curseurs.
   ========================================================================== */

import { POINTILLES_FANTOME, OPACITE_FANTOME } from './univers.js'

const COULEUR_A = '#4fd1c5'
const GLOW_A    = 'rgba(79, 209, 197, 0.35)'
const FANTOME_A = `rgba(79, 209, 197, ${OPACITE_FANTOME})`
const COULEUR_B = '#ff6b9d'
const GLOW_B    = 'rgba(255, 107, 157, 0.35)'
const FANTOME_B = `rgba(255, 107, 157, ${OPACITE_FANTOME})`
const JAUNE     = '#ffc107'
const GRILLE    = '#1c2432'

// En dessous de ce déplacement, la différence est du bruit de manipulation,
// pas une intention : on ne montre rien.
const SEUIL_DEPLACEMENT = 0.05

export const interpolationLineaire = {
  id: 'interpolation-lineaire',
  titre: 'Interpolation linéaire',

  repere: { echelle: 42, graduations: false },

  points: [
    { id: 'a', x: -2.0, y:  0.8, couleur: COULEUR_A },
    { id: 'b', x:  2.4, y: -1.2, couleur: COULEUR_B },
  ],

  curseurs: [
    { id: 't', min: 0, max: 1, pas: 0.01, defaut: 0.5, label: 't' },
  ],

  calculer([a, b], { t }) {
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    return { p, t }
  },

  dessiner(d, [a, b], val) {
    // Le chemin parcouru : un pointillé entre les pointes de A et de B.
    d.segment(a, b, { couleur: GRILLE, pointilles: [4, 4] })

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

    // A et B restent des vecteurs depuis l'origine, comme les autres notions.
    const origine = { x: 0, y: 0 }
    d.fleche(origine, a, { couleur: COULEUR_A, glow: GLOW_A })
    d.fleche(origine, b, { couleur: COULEUR_B, glow: GLOW_B })

    // Le point interpolé : pas un point manipulable, juste un résultat.
    d.point(val.p, { couleur: JAUNE, rayon: 10 })
  },

  lecture(val, [a, b]) {
    const n = (x) => x.toFixed(2)
    let verdict = 'Tu glisses entre A et B.'
    if (val.t <= 0.01) verdict = 'Tu es exactement sur A.'
    else if (val.t >= 0.99) verdict = 'Tu es exactement sur B.'
    else if (val.t === 0.5) verdict = 'Tu es exactement au milieu.'

    return {
      result: { label: 'P (point interpolé)', value: `(${n(val.p.x)}, ${n(val.p.y)})`, color: JAUNE },
      formula:
        `P = (<span class="va">${n(a.x)}</span>, <span class="va">${n(a.y)}</span>) + ` +
        `((<span class="vb">${n(b.x)}</span>, <span class="vb">${n(b.y)}</span>) − ` +
        `(<span class="va">${n(a.x)}</span>, <span class="va">${n(a.y)}</span>)) × ` +
        `<b style="color:${JAUNE}">${val.t.toFixed(2)}</b> = ` +
        `<b style="color:${JAUNE}">(${n(val.p.x)}, ${n(val.p.y)})</b>`,
      verdict,
    }
  },
}
