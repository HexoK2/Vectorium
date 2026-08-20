# Vectorium — liste de travail

## Comment utiliser ce fichier (instructions pour Claude Code)

- **Une tâche à la fois**, dans l'ordre. Ne prends pas d'avance sur la suivante.
- Avant d'écrire du code, **explique le raisonnement et attends l'accord**.
- Une tâche n'est cochée que si son « Terminé quand » est vraiment vérifié —
  page ouverte dans un navigateur, pas seulement code relu.
- Après chaque tâche : coche la case, demande à l'auteur son **temps estimé et
  son temps réel**, et note-les dans `journal.md`.
- Commit après chaque tâche cochée, avec un message qui dit ce qui a changé.
- Si une tâche demande de modifier `js/moteur/` pour une raison propre à une
  notion, **arrête-toi et signale-le** : la frontière est mal placée.

Les règles de fond (stack, architecture, contrat d'une notion) sont dans
`CLAUDE.md`. Lis-le d'abord.

---

## Maintenant — mise en ligne (ticket 01, étape 3)

- [ ] **Créer le dépôt Git local et le premier commit**
  Terminé quand : `git log` affiche un commit, et `git status` est propre.
  Attention : les fichiers `*.tmp` et `_git-*.bat` sont ignorés, vérifie qu'ils
  ne sont pas entrés dans le commit.

- [ ] **Pousser sur GitHub**
  Dépôt public nommé `Vectorium`, créé **vide** (sans README, sinon le push est
  refusé pour histoires divergentes).
  Terminé quand : les fichiers sont visibles sur github.com.

- [ ] **Activer GitHub Pages**
  Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
  Terminé quand : `https://<pseudo>.github.io/Vectorium/` affiche l'accueil.

- [ ] **Tester le site en ligne sur un vrai téléphone**
  Pas l'émulateur mobile de Chrome — un vrai appareil tactile.
  Terminé quand : les trois points sont vérifiés — l'accueil s'affiche, le lien
  vers la notion marche, et on déplace les flèches au doigt **sans que la page
  défile**.
  Piège probable : la casse des chemins. Windows ne distingue pas
  `js/Moteur/` de `js/moteur/`, GitHub Pages si.

---

## Finir le ticket 01

- [ ] **Compléter le README**
  Ajouter l'URL du site en ligne en haut, et cocher « produit scalaire » dans
  la feuille de route.
  Terminé quand : quelqu'un qui arrive sur le dépôt comprend en 30 secondes ce
  qu'est le projet et où le voir.

- [ ] **Faire tester la notion par une personne à qui on n'explique rien**
  Terminé quand : elle a compris toute seule qu'il faut attraper les pointes,
  en moins de cinq secondes. Sinon, corriger le texte d'introduction — pas le
  code.
  Note ce qu'elle a dit dans `journal.md`, même si c'est désagréable : c'est le
  genre de retour que le tuteur voudra voir.

---

## Ticket 02 — Produit vectoriel (semaine du 26/08)

- [ ] **Écrire `js/notions/produit-vectoriel.js`**
  Le moteur est en 2D : la notion traite donc le produit vectoriel **en 2D**,
  c'est-à-dire le scalaire `ax*by − ay*bx`. Ne construis pas de canvas 3D.
  Ce que la notion doit faire comprendre :
  - sa valeur absolue est **l'aire du parallélogramme** formé par A et B —
    donc dessine ce parallélogramme, c'est lui qui fait comprendre la notion ;
  - son **signe** donne l'orientation : positif si B est à gauche de A ;
  - il s'annule quand A et B sont **colinéaires** (là où le produit scalaire,
    lui, est maximal — le rapprochement mérite d'être écrit dans la page).
  Mentionne dans le texte qu'en 3D le résultat est un vecteur perpendiculaire
  aux deux autres, et que ce scalaire en est la composante z.
  Terminé quand : deux vecteurs colinéaires donnent 0.00, et A=(1,0) B=(0,1)
  donne exactement 1.00.

- [ ] **Créer `notions/produit-vectoriel.html` et le lien depuis l'accueil**
  Terminé quand : la page s'ouvre depuis l'accueil et se comporte comme celle
  du produit scalaire, sans qu'un seul fichier de `js/moteur/` ait été modifié.
  **C'est le test de l'architecture.** Si tu as dû toucher au moteur, dis-le.

- [ ] **Déployer et re-tester sur téléphone**
  Terminé quand : la nouvelle notion est en ligne et manipulable au doigt.

---

## Ticket 03 — Interpolation linéaire (semaine du 26/08)

- [ ] **Ajouter la gestion des curseurs au moteur**
  L'interpolation a besoin d'un paramètre `t` entre 0 et 1, donc d'un curseur —
  ce que le moteur ne sait pas encore faire.
  C'est une extension **générique** et légitime : une notion déclare
  `curseurs: [{ id, min, max, pas, defaut, label }]` et le moteur les fabrique
  et les passe à `calculer` et `dessiner`. Le moteur ne doit toujours pas
  savoir ce qu'est une interpolation.
  Terminé quand : les deux notions existantes fonctionnent encore à
  l'identique, sans curseur déclaré.

- [ ] **Écrire `js/notions/interpolation-lineaire.js` et sa page**
  `lerp(A, B, t) = A + (B − A) × t`. Montrer le point mobile sur le segment,
  et le fait que `t = 0` donne A, `t = 1` donne B, `t = 0.5` le milieu.
  Faire le lien avec Unity : c'est `Vector3.Lerp`, et c'est ce qui sert à faire
  suivre une caméra ou à adoucir un déplacement.
  Terminé quand : `t = 0.5` place le point exactement au milieu, vérifié à
  l'œil sur la grille.

- [ ] **Déployer et re-tester**

---

## Semaine du 02/09 — consolidation

- [ ] **Faire tester le site par deux ou trois camarades de promo**
  Note chaque incompréhension dans `journal.md`. Ne corrige rien pendant le
  test, observe.

- [ ] **Corriger ce que les tests ont révélé**, par ordre de gravité.

- [ ] **Soigner la page d'accueil** : elle doit expliquer en une phrase à qui
  s'adresse le site et pourquoi il existe.

- [ ] **Relire tout le code une dernière fois pour pouvoir l'expliquer.**
  Parcours chaque fichier avec l'auteur. Chaque fois qu'il ne sait pas
  réexpliquer un bloc, c'est un point à retravailler avant la présentation —
  c'est la tâche la plus importante de la semaine.

- [ ] **Compléter `journal.md`** : le tableau estimé / réel doit être entier,
  et la section « ce qui a été appris » doit contenir au moins trois constats
  honnêtes, y compris une estimation ratée.

- [ ] **GEL DU CODE — 07/09.** Après cette date, plus aucune fonctionnalité.
  Uniquement des corrections si quelque chose est cassé.

---

## Bonus — seulement si tout ce qui précède est fini et testé

- [ ] Transformer le site en PWA (manifest + service worker) pour l'icône sur
  l'écran d'accueil et l'ouverture en plein écran.

Ne commence pas ce bonus tant qu'une seule case au-dessus est décochée.

---

## À mentionner en démo, à ne PAS construire maintenant

- D'autres notions : matrices, courbes de Bézier, raycasting.
- Un coach adaptatif basé sur l'API Claude, qui expliquerait la notion
  différemment selon les erreurs de chacun.
