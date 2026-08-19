# Vectorium — instructions de travail

Ce fichier est lu automatiquement par Claude Code au démarrage d'une session
dans ce dossier. Il fixe les règles du projet.

## Contexte

Site interactif qui enseigne les maths du développement de jeu (vecteurs,
produit scalaire, produit vectoriel, interpolation, quaternions…). Chaque
notion est un canvas qu'on manipule à la souris ou au doigt, et dont les
valeurs se recalculent en direct.

L'auteur est étudiant, à l'aise en Unity/C# mais pas développeur web
professionnel. Le projet est présenté à un tuteur le 9-10 septembre.

## RÈGLE PRINCIPALE — à ne jamais contourner

**L'auteur doit pouvoir réexpliquer chaque ligne du code devant son tuteur.**

Concrètement :

- Explique le raisonnement AVANT d'écrire le code, et attends l'accord.
- Une tâche à la fois. Pas de refactor spontané de trois fichiers.
- Pas de dépendance ajoutée sans en discuter d'abord.
- Si une solution simple et une solution élégante s'opposent, propose la
  simple en premier et explique ce qu'on perd.
- À la fin d'une tâche, demande le temps estimé et le temps réel : ils
  alimentent `journal.md`, le tableau présenté au tuteur.

## Stack — contraintes fermes

- HTML / CSS / JavaScript vanilla. **Pas de framework, pas de build, pas de
  backend.** Le site doit se servir tel quel depuis GitHub Pages.
- Modules ES (`<script type="module">`). Donc pas de `file://` en local :
  `python -m http.server` puis `http://localhost:8000`.
- Compatible mobile et desktop, souris et tactile.

## Architecture — la frontière à ne pas franchir

```
js/moteur/     GÉNÉRIQUE — ne connaît aucune notion
  repere.js    canvas net (devicePixelRatio), conversions monde <-> écran, grille
  dessin.js    primitives : fleche, segment, point, arc, texte
  drag.js      Pointer Events (souris + tactile), test d'accroche en pixels
  module.js    monterModule(notion, element) — le contrat

js/notions/    SPÉCIFIQUE — un fichier par notion
notions/       une page HTML par notion
```

**Règle vérifiable : aucun fichier de `js/moteur/` ne doit mentionner une
notion en particulier.** Si ajouter une notion demande de modifier le moteur,
la frontière est mal placée — signale-le plutôt que de contourner.

### Le contrat d'une notion

Un fichier de `js/notions/` exporte un objet à quatre clés :

| clé | rôle |
|---|---|
| `points` | les points manipulables, en coordonnées monde |
| `calculer(pts)` | maths pures — ni canvas ni DOM, donc testable seul |
| `dessiner(d, pts, val)` | n'appelle que les primitives de `dessin.js` |
| `lecture(val)` | les lignes de valeurs affichées à côté du canvas |

Le moteur se charge du reste : dessiner les poignées, gérer le drag, le
redimensionnement, le rendu coalescé par `requestAnimationFrame`.

## Conventions

- Coordonnées **monde** partout dans la logique ; la conversion en pixels
  n'arrive qu'au moment de dessiner.
- Grandeur mathématique → unités monde. Décoration (épaisseur de trait, taille
  de pointe de flèche, rayon d'un point) → pixels.
- Noms de fichiers en minuscules avec des tirets, sans accent. GitHub Pages
  est sensible à la casse, Windows non : une majuscule oubliée marche en local
  et casse en ligne.
- Couleurs déclarées en variables CSS, jamais en dur dans le JavaScript.
- Commentaires et identifiants en français.

## Vérifier avant de dire que c'est fini

- Ouvrir la page dans un navigateur, pas seulement relire le code.
- Console sans erreur.
- Tester en étroit (390 px) autant qu'en large.
- Pour une notion : vérifier au moins un cas dont on connaît le résultat à la
  main (deux vecteurs perpendiculaires doivent donner un produit scalaire nul).

## Feuille de route

- Semaine du 19/08 : moteur générique + produit scalaire. **Fait.**
- Semaine du 26/08 : produit vectoriel, interpolation linéaire.
- Semaine du 02/09 : tests par des camarades, corrections, accueil, README.
  Gel du code le 07/09.
- Après le 9 septembre, à mentionner en démo sans le construire : plus de
  notions, puis éventuellement un coach adaptatif basé sur l'API Claude.

Bonus seulement si tout est fini et testé : transformer le site en PWA
(manifest + service worker).
