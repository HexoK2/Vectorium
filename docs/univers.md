# L'univers visuel de Vectorium

Une règle unique, valable pour toutes les notions présentes et futures :
**rien n'est montré seul. Chaque chose apparaît avec ce qu'elle n'est pas.**

Trois registres, pas deux. Dans le code (CSS comme JS), les deux qui
s'opposent se nomment `reel` et `fantome` — jamais `vrai` / `faux` : le
fantôme n'est pas le faux, c'est ce qui n'est pas, ou plus, le cas. Le
troisième, le décor, n'est ni l'un ni l'autre : c'est la scène sur laquelle
les deux autres se jouent.

| | **le décor** | **`reel`** | **`fantome`** |
|---|---|---|---|
| exemples | grille, axes, lignes de construction | un vecteur actuel, un résultat | une position de départ, une hypothèse |
| trait | plein | plein | pointillé, motif `[4, 5]` — un seul motif, déclaré une seule fois dans tout le site |
| couleur | neutre, très atténuée | saturée | même teinte que son `reel`, opacité 0.30 |
| halo | jamais | oui | **jamais** |
| remplissage | jamais | plein | **jamais** |

**Le discriminant tient en une phrase : le pointillé appartient au fantôme,
exclusivement.** Ce qui est plein mais atténué n'est pas un fantôme — c'est
du décor. Un chemin, une trajectoire, une droite de construction sont plein,
neutres, jamais pointillés : ils ne représentent ni un état présent ni un
état passé, ils sont le support sur lequel un état se lit.

Le halo et le remplissage plein sont réservés au réel, sans exception : c'est
ce qui rend le réel impossible à confondre avec le reste, même sur un écran
mal réglé ou pour quelqu'un qui distingue mal les couleurs.

## Ce que la règle interdit

- Aucune couleur décorative qui ne soit ni décor, ni `reel`, ni `fantome`.
- Aucun dégradé : un dégradé est un continuum, la règle est binaire (plein ou
  pointillé) à l'intérieur de chaque registre.
- Aucune ombre portée sur autre chose que le réel.
- Aucune forme qui ne représente pas un état ou la scène — donc pas de
  décoration géométrique gratuite.
- Un seul motif de pointillé dans tout le site, déclaré une seule fois
  (`[4, 5]`), jamais recopié avec des valeurs différentes — et il ne sert
  qu'au fantôme. Un trait plein et atténué qui n'est l'ombre d'aucun vecteur
  réel est du décor, pas un fantôme : il reste en trait plein.

## Où ça vit dans le code

- Les constantes partagées (`POINTILLES_FANTOME`, `OPACITE_FANTOME`) sont
  déclarées une fois dans `js/notions/univers.js` et importées par chaque
  notion — jamais recopiées.
- Chaque notion déclare ses propres couleurs `fantome` (une variante à
  opacité réduite de ses couleurs `reel`), suivant le même principe que les
  couleurs de halo déjà déclarées par notion.
- Le décor (grille, axes, lignes de construction) utilise les couleurs
  neutres déjà déclarées dans le repère (`--grid-line`, `--axis`) — jamais
  une couleur de vecteur, jamais de pointillé.
- Rien de tout ça ne touche `js/moteur/` : le moteur continue de ne
  connaître aucune notion. Les primitives existantes (`segment` avec
  `pointilles`, une couleur `rgba(...)` pour l'opacité) suffisent.
