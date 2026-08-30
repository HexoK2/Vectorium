/* =============================================================================
   saut-test.js — PROTOTYPE. Démonstration de l'addition de vecteurs
   (vélocité initiale + gravité) sur un saut réel avec personnage pixel art.
   ========================================================================== */

import { demarrerAnimation } from './animation.js'

export let etatSaut = {
  hauteur: 0,
  forceInitiale: 100,
  gravite: 9.8,
  scaleY: 1
}

// Grille du personnage — 10 colonnes × 15 lignes
const PERSONNAGE_DEBOUT = [
  "...####...",
  "..#oooo#..",
  ".#oooooo#.",
  ".#o*oo*o#.",
  ".#oooooo#.",
  "..#oooo#..",
  "..#oooo#..",
  ".#oooooo#.",
  "#oooooooo#",
  "#oooooooo#",
  "#oooooooo#",
  "#oooooooo#",
  "#oooooooo#",
  "#oooooooo#",
  "##########",
]

const PALETTE_PERSONNAGE = {
  '#': '#2b2320',  // contour
  'o': '#f2e9dc',  // remplissage
  '*': '#151515',  // yeux
}

const COULEUR_VEL_Y = '#4fd1c5'  // cyan — vélocité Y (vers le haut)
const COULEUR_GRAV   = '#ff5c5c'  // rouge — gravité (vers le bas)
const COULEUR_RES    = '#ffc107'  // jaune — résultante
const COULEUR_SOL    = '#3a4658'  // sol

export const sautTest = {
  id: 'saut-test',
  titre: 'Saut (prototype)',

  repere: { echelle: 42, graduations: false },

  curseurs: [
    { id: 'forceInitiale', min: 0, max: 500, pas: 10, defaut: 100, label: 'Force du saut' },
    { id: 'gravite', min: 0, max: 50, pas: 0.5, defaut: 9.8, label: 'Gravité' },
  ],

  points: [
    { id: 'start', x: 0, y: 0, couleur: '#fff', fixe: true },
  ],

  calculer(points, curseurs) {
    const forceInitiale = curseurs.forceInitiale || 100
    const gravite = curseurs.gravite || 9.8

    // Vélocité initiale Y (l'utilisateur n'en change que la magnitude via le slider)
    const velociteY = forceInitiale

    // Temps où le personnage retombe au sol
    const tAtterrissage = (2 * velociteY) / gravite

    // position(t) = 0 + velociteY × t + 0.5 × (-gravité) × t²
    const positionY = (t) => {
      const y = velociteY * t - 0.5 * gravite * t * t
      return Math.max(0, y)  // Bloqué au sol
    }

    // Vecteurs à afficher — en coordonnées monde
    const velY = { x: 0, y: velociteY }
    const grav = { x: 0, y: -gravite }
    const res = { x: 0, y: velociteY - gravite }  // Résultante (sans t, c'est juste la somme)

    return {
      velociteY,
      gravite,
      tAtterrissage,
      positionY,
      velY,
      grav,
      res,
    }
  },

  dessiner(d, points, val, curseurs) {
    // Mettre à jour l'état avec les curseurs actuels
    etatSaut.forceInitiale = curseurs.forceInitiale || 100
    etatSaut.gravite = curseurs.gravite || 9.8

    const { xMin, xMax } = d.repere.bornes()

    // Le sol
    d.segment({ x: xMin, y: 0 }, { x: xMax, y: 0 }, { couleur: COULEUR_SOL, epaisseur: 2 })

    // Position actuelle du personnage (avec hauteur du saut)
    const positionActuelle = { x: 0, y: etatSaut.hauteur }

    // Les trois vecteurs (échelle augmentée pour être visibles)
    const scale = 0.1
    d.fleche(positionActuelle, { x: val.velY.x, y: val.velY.y * scale }, { couleur: COULEUR_VEL_Y })
    d.fleche(positionActuelle, { x: val.grav.x, y: val.grav.y * scale }, { couleur: COULEUR_GRAV })
    d.fleche(positionActuelle, { x: val.res.x, y: val.res.y * scale }, { couleur: COULEUR_RES })

    // Le personnage (avec squash-and-stretch)
    d.sprite(positionActuelle, PERSONNAGE_DEBOUT, { taillePixel: 0.15, palette: PALETTE_PERSONNAGE, scaleY: etatSaut.scaleY })
  },

  lecture(val) {
    return {
      result: { label: 'Hauteur =', value: '0.00', color: '#fff' },
      formula: `v = ${val.velociteY.toFixed(1)}, g = ${val.gravite.toFixed(1)}`,
      verdict: `Vélocité Y (cyan) + Gravité (rouge) = Résultante (jaune). Animation en boucle.`,
    }
  },
}

export function lancerSautBoucle(moteur) {
  let lastForce = 100
  let lastGravite = 9.8

  function etape(t) {
    const forceInitiale = etatSaut.forceInitiale
    const gravite = etatSaut.gravite

    if (forceInitiale !== lastForce || gravite !== lastGravite) {
      console.log(`Curseurs mis à jour : Force=${forceInitiale}, Gravité=${gravite}`)
      lastForce = forceInitiale
      lastGravite = gravite
    }

    const velociteY = forceInitiale / 50
    const gNorm = gravite / 50
    const tAtterrissage = (2 * velociteY) / gNorm

    const tLocal = (t / 100) % (tAtterrissage || 1000)
    const y = velociteY * tLocal - 0.5 * gNorm * tLocal * tLocal
    etatSaut.hauteur = Math.max(0, y)

    // Squash-and-stretch : compressé au début/fin, étiré au sommet
    const progression = tLocal / (tAtterrissage || 1)
    const scaleY = 0.8 + 0.4 * Math.sin(progression * Math.PI)
    etatSaut.scaleY = scaleY

    moteur.rendre()
  }

  demarrerAnimation(moteur, etape, { condition: () => false })
}
