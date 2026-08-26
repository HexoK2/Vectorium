/* =============================================================================
   produit-scalaire.js — LA NOTION.
   Seul fichier du projet qui sait ce qu'est un produit scalaire.
   Il ne dessine rien lui-même : il demande au moteur de dessiner.

   Quatre clés, c'est tout le contrat :
     points     les vecteurs manipulables, en coordonnées monde
     calculer   les maths, sans canvas ni DOM
     dessiner   uniquement des primitives du moteur
     lecture    ce qui s'affiche dans le panneau de droite
   ========================================================================== */

import { POINTILLES_FANTOME, OPACITE_FANTOME } from './univers.js'

// Couleurs d'identité des deux vecteurs. Elles ne changent jamais : c'est ce
// qui permet de les distinguer. Seule la couleur du RÉSULTAT varie.
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

export const produitScalaire = {
  id: 'produit-scalaire',
  titre: 'Produit scalaire',

  // Options passées au repère : échelle, et grille nue sans graduations.
  repere: { echelle: 42, graduations: false },

  points: [
    { id: 'a', x:  2.4, y: -1.6, couleur: COULEUR_A },
    { id: 'b', x: -1.2, y: -2.0, couleur: COULEUR_B },
  ],

  /* --- 1) Les maths. Aucun canvas, aucun DOM : testable dans la console. --- */
  calculer([a, b]) {
    const dot = a.x * b.x + a.y * b.y

    const normeA = Math.hypot(a.x, a.y)
    const normeB = Math.hypot(b.x, b.y)

    // Garde-fou : si un vecteur est nul, le cosinus n'est pas défini.
    const denominateur = normeA * normeB
    const cos = denominateur > 1e-9 ? dot / denominateur : 0

    // Math.acos exige un argument dans [-1, 1] ; les arrondis flottants
    // peuvent produire 1.0000000002 et renvoyer NaN. D'où le bornage.
    const angleDeg = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI

    // Les seuils viennent de l'usage, pas des maths : en dessous de 0.6 en
    // valeur absolue, l'information utile est « ni l'un ni l'autre ».
    let couleur = GRIS
    let verdict = 'Perpendiculaires — les vecteurs ne pointent ni dans la même direction ni en sens opposé.'
    let label = 'perpendiculaire'
    if (dot > 0.6) {
      couleur = VERT
      verdict = 'Positif : les deux vecteurs pointent globalement dans la même direction — A voit dans la direction de B.'
      label = 'même sens'
    } else if (dot < -0.6) {
      couleur = ROUGE
      verdict = 'Négatif : les deux vecteurs pointent en sens opposés — ils regardent dos à dos.'
      label = 'sens opposé'
    }

    return { dot, normeA, normeB, cos, angleDeg, couleur, verdict, label }
  },

  /* --- 2) Le dessin. Rien d'autre que des primitives du moteur. ------------
     Le fantôme : si un point a été déplacé au-delà du seuil, on trace un
     trait pointillé vers sa position de départ. `this.points` est l'objet
     d'origine de la notion — celui que le bouton Réinitialiser utilise —
     jamais modifié par le moteur, donc toujours la vraie position de départ.
  ------------------------------------------------------------------------- */
  dessiner(d, [a, b], val) {
    const origine = { x: 0, y: 0 }

    for (const [actuel, depart, couleurFantome] of [
      [a, this.points[0], FANTOME_A],
      [b, this.points[1], FANTOME_B],
    ]) {
      const deplacement = Math.hypot(actuel.x - depart.x, actuel.y - depart.y)
      if (deplacement > SEUIL_DEPLACEMENT) {
        d.segment(depart, actuel, { couleur: couleurFantome, pointilles: POINTILLES_FANTOME })
      }
    }

    // Repère visuel en plus du chiffre : un arc coloré entre A et B, avec un
    // mot court. Sert à qui n'a pas encore appris à lire une formule.
    const angleA = Math.atan2(a.y, a.x)
    const angleB = Math.atan2(b.y, b.x)
    const diff = Math.atan2(Math.sin(angleB - angleA), Math.cos(angleB - angleA))
    const RAYON_ARC = 32
    d.arc(origine, RAYON_ARC, angleA, angleA + diff, { couleur: val.couleur, epaisseur: 2.5 })

    const bissectrice = angleA + diff / 2
    const distanceLabel = RAYON_ARC + 16
    d.texte(origine, val.label, {
      couleur: val.couleur,
      taille: 12,
      gras: true,
      decalage: { x: Math.cos(bissectrice) * distanceLabel, y: -Math.sin(bissectrice) * distanceLabel },
    })

    d.fleche(origine, a, { couleur: COULEUR_A, glow: GLOW_A })
    d.fleche(origine, b, { couleur: COULEUR_B, glow: GLOW_B })
  },

  /* --- 3) Le panneau de droite. -------------------------------------------
     On renvoie une structure, pas du HTML construit à la main : le moteur
     sait fabriquer ces quatre zones pour n'importe quelle notion.
  ------------------------------------------------------------------------- */
  lecture(v, [a, b]) {
    const n = (x) => x.toFixed(1)
    return {
      result: { label: 'A · B =', value: n(v.dot), color: v.couleur },
      formula:
        `A · B = (<span class="va">${n(a.x)}</span> × <span class="vb">${n(b.x)}</span>)` +
        ` + (<span class="va">${n(a.y)}</span> × <span class="vb">${n(b.y)}</span>)` +
        ` = <b style="color:${v.couleur}">${n(v.dot)}</b>`,
      verdict: v.verdict,
      angle: { label: 'angle entre A et B', value: `${v.angleDeg.toFixed(0)}°` },
    }
  },
}
