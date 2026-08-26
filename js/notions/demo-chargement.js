/* =============================================================================
   demo-chargement.js — fait tourner doucement un point autour de l'origine
   pendant quelques secondes au chargement de la page, pour que même quelqu'un
   qui ne touche jamais au canvas voie la relation de cause à effet.

   Générique au sens où il ne connaît aucune notion : il reçoit juste un point
   et une fonction de rendu. Il vit dans js/notions/ (pas js/moteur/) parce
   qu'il est utilisé depuis les pages, pas depuis le moteur lui-même.
   ========================================================================== */

export function demarrerDemoChargement({ points, rendre }, canvas, { indice = 0, duree = 3500, amplitudeDeg = 50 } = {}) {
  const point = points[indice]
  const rayon = Math.hypot(point.x, point.y)
  const angleDepart = Math.atan2(point.y, point.x)
  const amplitude = (amplitudeDeg * Math.PI) / 180

  let debut = null
  let actif = true
  let idAnimation = null

  function etape(temps) {
    if (!actif) return
    if (debut === null) debut = temps
    const t = Math.min((temps - debut) / duree, 1)

    // sin(t × 2π) balaie 0 -> +amplitude -> 0 -> -amplitude -> 0 : un seul
    // aller-retour complet sur la durée, jamais de répétition après.
    const decalage = Math.sin(t * Math.PI * 2) * amplitude
    const angle = angleDepart + decalage
    point.x = Math.cos(angle) * rayon
    point.y = Math.sin(angle) * rayon
    rendre()

    if (t < 1) {
      idAnimation = requestAnimationFrame(etape)
    } else {
      actif = false
    }
  }

  function arreter() {
    if (!actif) return
    actif = false
    if (idAnimation !== null) cancelAnimationFrame(idAnimation)
  }

  // La vraie manipulation prend le relais dès que l'utilisateur touche le
  // canvas — { once: true } retire l'écouteur après le premier déclenchement,
  // pas besoin de le faire à la main.
  canvas.addEventListener('pointerdown', arreter, { once: true })

  idAnimation = requestAnimationFrame(etape)
}
