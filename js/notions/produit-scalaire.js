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

// Couleurs d'identité des deux vecteurs. Elles ne changent jamais : c'est ce
// qui permet de les distinguer. Seule la couleur du RÉSULTAT varie.
const COULEUR_A = '#4fd1c5'
const GLOW_A    = 'rgba(79, 209, 197, 0.35)'
const COULEUR_B = '#ff6b9d'
const GLOW_B    = 'rgba(255, 107, 157, 0.35)'

const VERT  = '#59d97a'
const ROUGE = '#ff5c5c'
const GRIS  = '#d8dee8'

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
    if (dot > 0.6) {
      couleur = VERT
      verdict = 'Positif : les deux vecteurs pointent globalement dans la même direction — A voit dans la direction de B.'
    } else if (dot < -0.6) {
      couleur = ROUGE
      verdict = 'Négatif : les deux vecteurs pointent en sens opposés — ils regardent dos à dos.'
    }

    return { dot, normeA, normeB, cos, angleDeg, couleur, verdict }
  },

  /* --- 2) Le dessin. Rien d'autre que des primitives du moteur. ------------ */
  dessiner(d, [a, b]) {
    const origine = { x: 0, y: 0 }
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
