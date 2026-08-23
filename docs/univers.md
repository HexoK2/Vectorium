# L'univers visuel de Vectorium

Une règle unique, valable pour toutes les notions présentes et futures :
**rien n'est montré seul. Chaque chose apparaît avec ce qu'elle n'est pas.**

Deux familles, séparées par deux attributs absolus. Dans le code (CSS comme
JS), elles se nomment `reel` et `fantome` — jamais `vrai` / `faux` : le
fantôme n'est pas le faux, c'est ce qui n'est pas, ou plus, le cas.

| | **`reel`** | **`fantome`** |
|---|---|---|
| trait | plein | pointillé, motif `[4, 5]` — un seul motif, déclaré une seule fois dans tout le site |
| couleur | saturée | même teinte, opacité 0.30 |
| halo | oui | **jamais** |
| remplissage | plein | **jamais** |

Le halo et le remplissage plein sont réservés au réel, sans exception : c'est
ce qui rend les deux familles impossibles à confondre, même sur un écran mal
réglé ou pour quelqu'un qui distingue mal les couleurs.

Le fantôme, ce sont par exemple : une position de départ avant un
déplacement, une hypothèse posée avant vérification, plus tard le résultat
d'un code erroné qu'on compare au bon résultat.

## Ce que la règle interdit

- Aucune couleur décorative qui ne soit ni `reel` ni `fantome`.
- Aucun dégradé : un dégradé est un continuum, la règle est binaire.
- Aucune ombre portée sur autre chose que le réel.
- Aucune forme qui ne représente pas un état — donc pas de décoration
  géométrique en fond.
- Un seul motif de pointillé dans tout le site, déclaré une seule fois
  (`[4, 5]`), jamais recopié avec des valeurs différentes.

## Où ça vit dans le code

- Les constantes partagées (`POINTILLES_FANTOME`, `OPACITE_FANTOME`) sont
  déclarées une fois dans `js/notions/univers.js` et importées par chaque
  notion — jamais recopiées.
- Chaque notion déclare ses propres couleurs `fantome` (une variante à
  opacité réduite de ses couleurs `reel`), suivant le même principe que les
  couleurs de halo déjà déclarées par notion.
- Rien de tout ça ne touche `js/moteur/` : le moteur continue de ne
  connaître aucune notion. Les primitives existantes (`segment` avec
  `pointilles`, une couleur `rgba(...)` pour l'opacité) suffisent.
