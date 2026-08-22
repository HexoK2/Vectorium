/* =============================================================================
   module.js — la colle. C'est ici qu'est écrit LE CONTRAT entre le moteur et
   une notion.

   Une notion est un objet à quatre clés :

     points          les points manipulables, en coordonnées monde
     calculer(pts, curseurs)   maths pures — ni canvas ni DOM, donc testable
                               seul ; curseurs optionnel
     dessiner(d, pts, val, curseurs)   n'appelle que les primitives de
                                       dessin.js ; curseurs optionnel
     lecture(val, pts)   les lignes de valeurs affichées à côté du canvas
                         pts optionnel pour afficher les composantes

   Une cinquième clé optionnelle :

     curseurs   [{ id, min, max, pas, defaut, label }] — des paramètres
                numériques (ex. t d'une interpolation) que le moteur fabrique
                en curseurs HTML et transmet à calculer() et dessiner(). Une
                notion sans curseurs n'a rien à faire de plus.

   monterModule() ne sait rien d'autre. Ajouter une notion = écrire un fichier
   qui exporte ces clés. Aucun fichier de js/moteur/ n'est à modifier.
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

  // Même principe pour les curseurs : un objet { id: valeur }, initialisé à
  // la valeur par défaut déclarée par la notion. Une notion sans curseurs a
  // simplement un tableau vide — rien de plus à faire pour elle.
  const curseursConfig = notion.curseurs || []
  const curseurs = {}
  curseursConfig.forEach((c) => { curseurs[c.id] = c.defaut })

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

  /* --- Les curseurs -----------------------------------------------------
     Fabriqués uniquement si la notion en déclare. Le conteneur est cherché
     dans la page (data-curseurs) ; s'il n'existe pas, on le crée et on
     l'ajoute à la suite du canvas — une page qui n'a pas ce bloc n'a qu'à
     ne pas s'en soucier.
  --------------------------------------------------------------------------- */
  const entreesCurseurs = {}

  function decimalesDuPas(pas) {
    const texte = String(pas)
    const point = texte.indexOf('.')
    return point === -1 ? 0 : texte.length - point - 1
  }

  if (curseursConfig.length) {
    let conteneur = racine.querySelector('[data-curseurs]')
    if (!conteneur) {
      conteneur = document.createElement('div')
      conteneur.className = 'curseurs'
      const colonneScene = racine.querySelector('.colonne-scene') || racine
      colonneScene.append(conteneur)
    }

    curseursConfig.forEach((c) => {
      const decimales = decimalesDuPas(c.pas)

      const ligne = document.createElement('div')
      ligne.className = 'curseur-ligne'

      const label = document.createElement('span')
      label.className = 'curseur-label'
      label.textContent = c.label

      const input = document.createElement('input')
      input.type = 'range'
      input.min = c.min
      input.max = c.max
      input.step = c.pas
      input.value = c.defaut

      const valeur = document.createElement('span')
      valeur.className = 'curseur-valeur'
      valeur.textContent = c.defaut.toFixed(decimales)

      input.addEventListener('input', () => {
        curseurs[c.id] = parseFloat(input.value)
        valeur.textContent = curseurs[c.id].toFixed(decimales)
        demanderRendu()
      })

      ligne.append(label, input, valeur)
      conteneur.append(ligne)
      entreesCurseurs[c.id] = { input, valeur, decimales }
    })
  }

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
      // Nouveau format readout, commun aux trois notions actuelles
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
    repere.dessinerGrille(notion.repere)

    const valeurs = notion.calculer(points, curseurs)

    // La notion dessine ce qui lui est propre…
    notion.dessiner(dessin, points, valeurs, curseurs)

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

    // On passe aussi les points : une notion peut vouloir afficher ses
    // propres composantes. Le moteur, lui, ne sait toujours pas ce qu'elles
    // représentent — il transmet, c'est tout.
    afficherLecture(notion.lecture(valeurs, points))
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

      curseursConfig.forEach((c) => {
        curseurs[c.id] = c.defaut
        const entree = entreesCurseurs[c.id]
        entree.input.value = c.defaut
        entree.valeur.textContent = c.defaut.toFixed(entree.decimales)
      })

      demanderRendu()
    })
  }

  rendre()

  return { points, rendre: demanderRendu, repere }
}
