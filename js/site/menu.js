/* =============================================================================
   menu.js — le menu latéral : navigation, thème clair/sombre, rien d'autre.
   Ne touche à aucune notion, aucun canvas, aucun drag. Vit dans js/site/ pour
   bien le séparer de js/moteur/ (générique aux notions) et js/notions/
   (spécifique à chaque notion) : ce fichier ne connaît ni l'un ni l'autre.

   La clé du thème dans localStorage : 'vectorium-theme', valeur 'light' ou
   absente (= sombre, le thème par défaut). Le thème est déjà appliqué avant
   ce script par un petit script synchrone dans <head> de chaque page — sans
   ça, la page flasherait en sombre une fraction de seconde avant de passer
   en clair.
   ========================================================================== */

const CLE_THEME = 'vectorium-theme'

function initMenu() {
  const bouton = document.getElementById('menu-hamburger')
  const menu = document.getElementById('menu-lateral')
  const fond = document.getElementById('menu-fond')

  function ouvrir() {
    menu.classList.add('ouvert')
    fond.classList.add('visible')
    bouton.setAttribute('aria-expanded', 'true')
  }

  function fermer() {
    menu.classList.remove('ouvert')
    fond.classList.remove('visible')
    bouton.setAttribute('aria-expanded', 'false')
  }

  bouton.addEventListener('click', () => {
    const ouvert = menu.classList.contains('ouvert')
    if (ouvert) fermer(); else ouvrir()
  })

  fond.addEventListener('click', fermer)

  // Sur mobile, choisir une notion referme le menu — sur desktop le menu
  // reste fixe de toute façon, ce clic n'a alors aucun effet visible.
  menu.querySelectorAll('.menu-liens a').forEach((lien) => {
    lien.addEventListener('click', fermer)
  })

  // La page courante, marquée sans dupliquer le HTML à chaque page :
  // comparaison sur le chemin, que le lien vienne de la racine ou d'un
  // sous-dossier (../notions/...).
  menu.querySelectorAll('.menu-liens a').forEach((lien) => {
    if (lien.pathname === location.pathname) {
      lien.classList.add('actif')
    }
  })
}

function initTheme() {
  const bouton = document.getElementById('menu-theme')
  const icone = bouton.querySelector('.menu-theme-icone')
  const texte = bouton.querySelector('.menu-theme-texte')

  function lireThemeActuel() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  }

  function afficher(theme) {
    icone.textContent = theme === 'light' ? '🌙' : '☀️'
    texte.textContent = theme === 'light' ? 'Sombre' : 'Clair'
  }

  afficher(lireThemeActuel())

  bouton.addEventListener('click', () => {
    const nouveau = lireThemeActuel() === 'light' ? 'dark' : 'light'

    if (nouveau === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    // localStorage peut être bloqué (navigation privée stricte) : le thème
    // change quand même pour cette visite, juste sans persister.
    try {
      localStorage.setItem(CLE_THEME, nouveau)
    } catch {
      // Rien à faire de plus : le confort de persistance disparaît, pas le
      // reste du site.
    }

    afficher(nouveau)
  })
}

initMenu()
initTheme()
