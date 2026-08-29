# Vectorium

Comprendre les maths du développement de jeu en les manipulant, pas en les lisant.

Chaque notion (produit scalaire, produit vectoriel, interpolation…) est un petit
canvas interactif : on attrape les vecteurs à la souris ou au doigt, et le
résultat se recalcule en direct.

**En ligne :** https://HexoK2.github.io/Vectorium/

---

## Pourquoi

Beaucoup de débutants sur Unity bloquent sur les mêmes notions, non pas parce que
les formules sont difficiles, mais parce qu'elles restent abstraites. Un produit
scalaire écrit `ax*bx + ay*by` ne dit rien ; le même produit scalaire qui passe de
vert à rouge quand on retourne un vecteur se comprend en trois secondes.

## Lancer le projet en local

Le projet utilise les modules ES. Ouvrir `index.html` par double-clic **ne
fonctionne pas** : le navigateur bloque les imports en `file://`. Il faut un
serveur local.

```bash
python -m http.server
```

Puis ouvrir <http://localhost:8000>.

Aucune dépendance, aucune étape de build : HTML/CSS/JS vanilla.

## Structure

```
vectorium/
├── index.html                  # accueil : la liste des notions
├── css/vectorium.css           # palette, typographie, styles partagés
├── js/
│   ├── moteur/                 # générique — ne connaît aucune notion
│   │   ├── repere.js           # canvas net, conversions monde <-> écran, grille
│   │   ├── dessin.js           # primitives : flèche, segment, point, arc, texte
│   │   ├── drag.js             # Pointer Events (souris + tactile)
│   │   └── module.js           # monterModule(notion, element) — le contrat
│   ├── notions/                # spécifique — un fichier par notion
│   └── site/                   # chrome du site (menu, thème) — ne connaît ni le moteur ni les notions
├── notions/                    # une page HTML par notion
├── cours/                      # une page de cours par notion, pour approfondir
└── reference/                  # le prototype d'origine — le rendu visuel de référence
```

**Règle vérifiable :** aucun fichier de `js/moteur/` ne doit mentionner une
notion en particulier. Si ajouter une notion demande de modifier le moteur,
la frontière est mal placée.

## Ajouter une notion

1. Écrire `js/notions/ma-notion.js`, qui exporte un objet à quatre clés :

   | clé | rôle |
   |---|---|
   | `points` | les points manipulables, en coordonnées monde |
   | `calculer(pts)` | maths pures — ni canvas ni DOM, donc testable seule |
   | `dessiner(d, pts, val)` | n'appelle que les primitives de `dessin.js` |
   | `lecture(val, pts?)` | les lignes de valeurs affichées à côté du canvas |

2. Créer `notions/ma-notion.html` sur le modèle d'une notion existante (par
   exemple `notions/produit-scalaire.html`).
3. Ajouter la carte à `index.html`.

Le moteur (`js/moteur/`) se charge du reste : dessiner les poignées, gérer le
drag, le redimensionnement, le rendu coalescé par `requestAnimationFrame`.

## Feuille de route

- [x] Produit scalaire
- [x] Produit vectoriel
- [x] Interpolation linéaire
- [x] Matrices

D'autres notions (quaternions, courbes de Bézier…) sont un horizon v2, pas une
prochaine étape immédiate.

## Licence

MIT.
