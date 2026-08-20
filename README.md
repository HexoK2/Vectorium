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
python3 -m http.server
```

Puis ouvrir <http://localhost:8000>.

Aucune dépendance, aucune étape de build : HTML/CSS/JS vanilla.

## Structure

```
vectorium/
├── index.html                  # accueil : la liste des notions
├── notions/                    # une page HTML par notion
├── css/vectorium.css           # palette, typographie, styles partagés
└── reference/                  # démonstrations de design
```

## Ajouter une notion

1. Créer `notions/ma-notion.html` sur le modèle de `notions/produit-scalaire.html`.
2. La page contient un `<script type="module">` qui définit la logique et le rendu.
3. Ajouter le lien dans `index.html`.

Chaque notion est autonome : pas de dépendance externe, pas de build, HTML/CSS/JS vanilla.

## Feuille de route

- [x] Produit scalaire
- [ ] Produit vectoriel
- [ ] Interpolation linéaire
- [ ] Premiers pas sur les quaternions

## Licence

MIT.
