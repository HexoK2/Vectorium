/* =============================================================================
   module.js — la colle. C'est ici qu'est écrit LE CONTRAT entre le moteur et
   une notion.

   Une notion est un objet à quatre clés :

     points          les points manipulables, en coordonnées monde
     calculer(pts)   maths pures — ni canvas ni DOM, donc testable seul
     dessiner(d, pts, val)   n'appelle que les primitives de dessin.js
     lecture(val)    les lignes de valeurs affichées à côté du canvas

   monterModule() ne sait rien d'autre. Ajouter une notion = écrire un fichier
   qui exporte ces quatre clés. Aucun fichier de js/moteur/ n'est à modifier.
   ========================================================================== */

import { creerRepere } from './repere.js'
import { creerDessin } from './dessin.js'
import { activerDrag } from './drag.js'

export function monterModule(notion, racine) {
  const canvas = racine.querySelector('canvas')
  const panneau = racine.querySelector('[data-panneau]')
  const boutonReinit = racine.querySelector('[data-reinitialiser]')

  const repere = creerRepere(canvas, notion.repere)
  const dessin = creerDessin(repere)

  // On travaille sur une COPIE des points. L'objet exporté par la notion reste
  // intact, ce qui permet de réinitialiser à tout moment — et évite qu'un
  // module en modifie un autre si un jour deux modules partagent une notion.
  const points = notion.points.map((p) => ({ ...p }))

  /* --- Rendu à la demande ---------------------------------------------------
     Le navigateur peut envoyer plusieurs pointermove par image affichée.
     Redessiner à chaque événement, c'est travailler pour rien.

     On lève donc un drapeau « il faudra redessiner » et requestAnimationFrame
     déclenche UN seul rendu juste avant la prochaine image. Dix événements
     rapprochés produisent un seul dessin.

     C'est aussi pour ça qu'on ne fait pas une boucle d'animation permanente :
     une page qui redessine 60 fois par seconde alors que rien ne bouge vide la
     batterie d'un téléphone pour rien.
  --------------------------------------------------------------------------- */
  let renduDemande = false
  function demanderRendu() {
    if (renduDemande) return
    renduDemande = true
    requestAnimationFrame(() => {
      renduDemande = false
      rendre()
    })
  }

  const etatDrag = activerDrag(canvas, repere, { points, onChange: demanderRendu })

  /* --- Le panneau de valeurs ------------------------------------------------
     Structure générique pour afficher les résultats. Peut être soit un simple
     tableau de valeurs (ancien format) soit un objet readout (nouveau format).
  --------------------------------------------------------------------------- */
  let elements = {}

  function afficherLecture(donnees) {
    if (!panneau) return

    // Détect le format : tableau de {label, valeur} ou objet readout
    const estReadout = donnees && typeof donnees === 'object' && !Array.isArray(donnees)

    if (estReadout) {
      // Nouveau format readout pour produit scalaire
      afficherReadout(donnees)
    } else {
      // Ancien format : tableau de lignes
      afficherAncienFormat(donnees || [])
    }
  }

  function afficherReadout(readout) {
    if (elements.resultValue) {
      // Mise à jour : changement juste les valeurs
      if (readout.result) {
        elements.resultValue.textContent = readout.result.value
        elements.resultValue.style.color = readout.result.color || 'var(--neutral)'
      }
      if (readout.formula) {
        elements.formula.innerHTML = readout.formula
      }
      if (readout.verdict) {
        elements.verdict.textContent = readout.verdict
      }
      if (readout.angle) {
        elements.angleValue.textContent = readout.angle.value
      }
    } else {
      // Construction initiale
      panneau.innerHTML = ''
      if (readout.result) {
        const resultDiv = document.createElement('div')
        const resultLabel = document.createElement('div')
        resultLabel.className = 'result-label'
        resultLabel.textContent = readout.result.label
        const resultValue = document.createElement('div')
        resultValue.className = 'result-value'
        resultValue.id = 'resultValue'
        resultValue.textContent = readout.result.value
        resultValue.style.color = readout.result.color || 'var(--neutral)'
        resultDiv.append(resultLabel, resultValue)
        panneau.append(resultDiv)
        elements.resultValue = resultValue
      }

      if (readout.formula) {
        const formulaDiv = document.createElement('div')
        formulaDiv.className = 'formula'
        formulaDiv.id = 'formulaText'
        formulaDiv.innerHTML = readout.formula
        panneau.append(formulaDiv)
        elements.formula = formulaDiv
      }

      if (readout.verdict) {
        const verdictDiv = document.createElement('div')
        verdictDiv.className = 'verdict'
        verdictDiv.id = 'verdictText'
        verdictDiv.textContent = readout.verdict
        panneau.append(verdictDiv)
        elements.verdict = verdictDiv
      }

      if (readout.angle) {
        const angleRow = document.createElement('div')
        angleRow.className = 'angle-row'
        const angleLabel = document.createElement('span')
        angleLabel.textContent = readout.angle.label
        const angleValue = document.createElement('b')
        angleValue.id = 'angleValue'
        angleValue.textContent = readout.angle.value
        angleRow.append(angleLabel, angleValue)
        panneau.append(angleRow)
        elements.angleValue = angleValue
      }
    }
  }

  function afficherAncienFormat(donnees) {
    let lignes = elements.lignes || []

    if (lignes.length !== donnees.length) {
      panneau.textContent = ''
      lignes = donnees.map(() => {
        const ligne = document.createElement('div')
        ligne.className = 'valeur'
        const label = document.createElement('span')
        label.className = 'valeur-label'
        const nombre = document.createElement('span')
        nombre.className = 'valeur-nombre'
        ligne.append(label, nombre)
        panneau.append(ligne)
        return { label, nombre }
      })
      elements.lignes = lignes
    }

    donnees.forEach((d, i) => {
      lignes[i].label.textContent = d.label
      lignes[i].nombre.textContent = d.valeur
      lignes[i].nombre.style.color = d.couleur || ''
    })
  }

  function rendre() {
    repere.effacer()
    repere.dessinerGrille()

    const valeurs = notion.calculer(points)

    // La notion dessine ce qui lui est propre…
    notion.dessiner(dessin, points, valeurs)

    // …puis le moteur dessine les poignées, identiques pour toutes les notions.
    for (const p of points) {
      if (p.fixe) continue
      const actif = etatDrag.actif === p || etatDrag.survole === p
      dessin.point(p, { couleur: p.couleur, actif })
      if (p.label) {
        dessin.texte(p, p.label, {
          couleur: p.couleur,
          gras: true,
          decalage: { x: 0, y: -18 },
        })
      }
    }

    afficherLecture(notion.lecture(valeurs))
  }

  // ResizeObserver suit la taille réelle de l'élément, y compris quand elle
  // change sans que la fenêtre bouge (rotation du téléphone, panneau latéral
  // qui apparaît). Plus fiable que window.onresize.
  new ResizeObserver(() => {
    repere.redimensionner()
    rendre()
  }).observe(canvas)

  if (boutonReinit) {
    boutonReinit.addEventListener('click', () => {
      notion.points.forEach((origine, i) => Object.assign(points[i], origine))
      demanderRendu()
    })
  }

  rendre()

  return { points, rendre: demanderRendu, repere }
}
