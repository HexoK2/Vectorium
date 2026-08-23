/* =============================================================================
   univers.js — les deux familles visuelles du site : réel et fantôme.
   Règle complète dans docs/univers.md. Ce fichier ne dessine rien : il ne
   fait que déclarer, une seule fois, ce que chaque notion doit réutiliser
   telle quelle pour que le fantôme ait le même motif partout.
   ========================================================================== */

// Un seul motif de pointillé dans tout le site — jamais recopié avec des
// valeurs différentes.
export const POINTILLES_FANTOME = [4, 5]

// Le fantôme n'est jamais saturé : toujours la même teinte, à cette opacité.
export const OPACITE_FANTOME = 0.30
