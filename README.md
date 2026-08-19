# Vectorium

Comprendre les maths du développement de jeu en les manipulant, pas en les lisant.

Chaque notion (produit scalaire, produit vectoriel, interpolation…) est un petit
canvas interactif : on attrape les vecteurs à la souris ou au doigt, et le
résultat se recalcule en direct.

**En ligne :** _(à compléter à l'étape 3 — URL GitHub Pages)_

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
python3 -m http.server
```

Puis ouvrir <http://localhost:8000>.

Aucune dépendance, aucune étape de build : HTML/CSS/JS vanilla.

## Structure

```
vectorium/
├── index.html                  # accueil : la liste des notions
├── notions/                    # une page HTML par notion
├── css/vectorium.css
└── js/
    ├── moteur/                 # GÉNÉRIQUE — ne connaît aucune notion
    │   ├── repere.js           # canvas, coordonnées monde ↔ écran, grille
    │   ├── dessin.js           # primitives : flèche, point, arc, texte
    │   ├── drag.js             # manipulation souris + tactile
    │   └── module.js           # assemble les trois au-dessus
    └── notions/                # SPÉCIFIQUE — un fichier par notion
        └── produit-scalaire.js
```

La règle qui tient l'architecture : **aucun fichier de `js/moteur/` ne mentionne
une notion en particulier.** Si ajouter une notion oblige à modifier le moteur,
la frontière est mal placée.

## Ajouter une notion

1. Créer `js/notions/ma-notion.js` exportant un objet à quatre clés :

   | clé | rôle |
   |---|---|
   | `points` | les points manipulables, en coordonnées monde |
   | `calculer(pts)` | maths pures — ni canvas ni DOM, donc testable seul |
   | `dessiner(r, pts, val)` | n'appelle que les primitives du moteur |
   | `lecture(val)` | les valeurs affichées à côté du canvas |

2. Créer `notions/ma-notion.html` sur le modèle d'une page existante.
3. Ajouter le lien dans `index.html`.

Aucune modification du moteur n'est nécessaire.

## Feuille de route

- [ ] Moteur de canvas générique + produit scalaire
- [ ] Produit vectoriel
- [ ] Interpolation linéaire
- [ ] Premiers pas sur les quaternions

## Licence

MIT.
