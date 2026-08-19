/* =============================================================================
   repere.js — le pont entre le monde des maths et le monde des pixels.
   GÉNÉRIQUE : ce fichier ne connaît aucune notion. Il ne sait que deux choses,
   convertir des coordonnées et dessiner une grille.

   Deux systèmes de coordonnées cohabitent :

     MONDE            origine au centre,        y vers le HAUT,   unité = 1
     ÉCRAN (canvas)   origine en haut à gauche, y vers le BAS,    unité = 1 pixel

   Toute la logique et toutes les maths travaillent en coordonnées MONDE.
   La conversion n'arrive qu'au dernier moment, au moment de dessiner.
   C'est exactement la distinction world space / screen space d'Unity.
   ========================================================================== */

export function creerRepere(canvas, options = {}) {
  const ctx = canvas.getContext('2d')

  // Combien de pixels CSS pour une unité du monde.
  const echelle = options.echelle ?? 48

  // Taille du canvas en pixels CSS, et position de l'origine du monde dedans.
  // Recalculées à chaque redimensionnement.
  let largeur = 0
  let hauteur = 0
  let cx = 0
  let cy = 0

  // Les couleurs sont lues dans les variables CSS : le moteur n'en code aucune
  // en dur, changer le thème ne demande pas de toucher au JavaScript.
  // Le second argument est une valeur de secours si la variable n'existe pas.
  const style = getComputedStyle(document.documentElement)
  const lireCouleur = (nom, defaut) => style.getPropertyValue(nom).trim() || defaut
  const couleurs = {
    grille: lireCouleur('--grid-line', '#1c2432'),
    axe:    lireCouleur('--axis',      '#3a4658'),
    texte:  lireCouleur('--text-low',  '#566072'),
  }

  /* ---------------------------------------------------------------------------
     Redimensionnement et netteté

     Un canvas a DEUX tailles : sa taille d'affichage (fixée par le CSS) et la
     taille de son buffer de pixels (canvas.width / canvas.height). Si on ne
     s'occupe que de la première, le navigateur étire une image de 800 pixels
     sur un écran qui en affiche 1600 — d'où le flou sur mobile et sur écran
     Retina.

     La règle : buffer = taille CSS × devicePixelRatio, puis on applique une
     transformation d'échelle au contexte pour pouvoir continuer à écrire notre
     code en pixels CSS sans penser au ratio.
  --------------------------------------------------------------------------- */
  function redimensionner() {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    largeur = rect.width
    hauteur = rect.height

    canvas.width  = Math.round(largeur * dpr)
    canvas.height = Math.round(hauteur * dpr)

    // setTransform remplace la transformation courante (au lieu de s'y ajouter
    // comme scale()), donc appeler redimensionner() plusieurs fois est sans
    // danger : les facteurs ne s'accumulent pas.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // L'origine du monde est au centre du canvas.
    cx = largeur / 2
    cy = hauteur / 2
  }

  /* ---------------------------------------------------------------------------
     Les deux conversions. Tout le retournement de l'axe y tient dans le signe
     moins : en monde, y grandit vers le haut ; à l'écran, vers le bas.
  --------------------------------------------------------------------------- */
  const versEcran = (p) => ({ x: cx + p.x * echelle, y: cy - p.y * echelle })
  const versMonde = (p) => ({ x: (p.x - cx) / echelle, y: (cy - p.y) / echelle })

  // Position d'un événement pointeur, directement en coordonnées monde.
  // clientX/clientY sont relatifs à la fenêtre : on retire la position du
  // canvas pour obtenir des coordonnées internes au canvas.
  function positionPointeur(evt) {
    const rect = canvas.getBoundingClientRect()
    return versMonde({ x: evt.clientX - rect.left, y: evt.clientY - rect.top })
  }

  // Les bords du canvas exprimés en unités monde : sert à ne dessiner que les
  // lignes de grille réellement visibles, quelle que soit la taille de l'écran.
  function bornes() {
    return {
      xMin: -cx / echelle,
      xMax: (largeur - cx) / echelle,
      yMin: (cy - hauteur) / echelle,
      yMax: cy / echelle,
    }
  }

  function effacer() {
    ctx.clearRect(0, 0, largeur, hauteur)
  }

  /* ---------------------------------------------------------------------------
     La grille et les axes.

     On boucle sur les entiers du monde visibles, pas sur les pixels : le code
     dit « une ligne à chaque unité », ce qui reste vrai si on change l'échelle.

     Le décalage de 0.5 pixel avant de tracer une ligne de 1 pixel d'épaisseur
     est une astuce classique du canvas : une ligne centrée sur un entier déborde
     d'un demi-pixel de chaque côté et sort grise sur deux pixels. Centrée sur
     un demi, elle tombe pile sur un pixel et sort nette.
  --------------------------------------------------------------------------- */
  function dessinerGrille({ graduations = true } = {}) {
    const { xMin, xMax, yMin, yMax } = bornes()

    // --- lignes fines, une par unité ---
    ctx.lineWidth = 1
    ctx.strokeStyle = couleurs.grille
    ctx.beginPath()

    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const px = Math.round(versEcran({ x, y: 0 }).x) + 0.5
      ctx.moveTo(px, 0)
      ctx.lineTo(px, hauteur)
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const py = Math.round(versEcran({ x: 0, y }).y) + 0.5
      ctx.moveTo(0, py)
      ctx.lineTo(largeur, py)
    }
    ctx.stroke()

    // --- les deux axes, plus marqués ---
    const origine = versEcran({ x: 0, y: 0 })
    ctx.lineWidth = 1.5
    ctx.strokeStyle = couleurs.axe
    ctx.beginPath()
    ctx.moveTo(0, Math.round(origine.y) + 0.5)
    ctx.lineTo(largeur, Math.round(origine.y) + 0.5)
    ctx.moveTo(Math.round(origine.x) + 0.5, 0)
    ctx.lineTo(Math.round(origine.x) + 0.5, hauteur)
    ctx.stroke()

    if (!graduations) return

    // --- les nombres le long des axes ---
    ctx.fillStyle = couleurs.texte
    ctx.font = '11px system-ui, sans-serif'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue
      const p = versEcran({ x, y: 0 })
      ctx.fillText(String(x), p.x, p.y + 5)
    }

    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue
      const p = versEcran({ x: 0, y })
      ctx.fillText(String(y), p.x - 6, p.y)
    }
  }

  redimensionner()

  // On expose largeur/hauteur/echelle en lecture seule (get) : les modules en
  // ont besoin pour se repérer, mais personne ne doit pouvoir les écrire
  // directement — seul redimensionner() a le droit de les changer.
  return {
    ctx,
    redimensionner,
    versEcran,
    versMonde,
    positionPointeur,
    bornes,
    effacer,
    dessinerGrille,
    couleurs,
    get echelle() { return echelle },
    get largeur() { return largeur },
    get hauteur() { return hauteur },
  }
}
