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
- Ne supprime jamais un dossier entier sans demander. Si une partie du code te
  semble inutilisée, cherche d'abord ce qui l'a débranchée.

Les règles de fond (stack, architecture, contrat d'une notion, design) sont
dans `CLAUDE.md`. Lis-le d'abord.

---

## Déjà fait

- [x] Moteur générique : `repere.js`, `dessin.js`, `drag.js`, `module.js`
- [x] Notion « produit scalaire » branchée sur le moteur
- [x] Rendu visuel du prototype appliqué, style centralisé dans `vectorium.css`
- [x] Dépôt Git, push, GitHub Pages, test sur téléphone

---

## Maintenant — ce que le test sur téléphone a révélé

Le site se manipule bien, mais il n'explique rien : on comprend ce qui bouge,
pas pourquoi ça compte. C'est la priorité, avant d'ajouter d'autres notions.

- [x] **Bloc « En clair » sous le canvas, sur la page du produit scalaire**
  Trois courtes sections, dans cet ordre, sous la manipulation :
  1. *À quoi ça sert dans un jeu* — l'exemple concret : savoir si un ennemi est
     devant ou derrière le joueur, si le joueur regarde vers un objet, si une
     surface fait face à la lumière. C'est cette section qui donne envie de
     lire les deux autres, pas l'inverse.
  2. *Ce que dit la formule* — `ax*bx + ay*by`, et pourquoi ce nombre mesure
     « à quel point les deux vont dans la même direction ».
  3. *L'erreur classique* — confondre le produit scalaire avec la distance, et
     oublier de normaliser quand on veut seulement l'angle.
  Chaque section : trois à cinq lignes maximum. Si ça déborde, c'est que le
  contenu appartient à la page de cours.
  Le style va dans `css/vectorium.css` sous des classes réutilisables — cette
  mise en page devient le gabarit de toutes les notions.
  Terminé quand : la page se lit de bout en bout sur un téléphone sans zoomer,
  et quelqu'un qui n'a jamais fait de maths de jeu comprend à quoi ça sert.

- [x] **Page de cours `cours/produit-scalaire.html`**
  Le texte long : d'où vient la formule, le lien avec le cosinus, la
  normalisation, deux ou trois exemples de code Unity (`Vector3.Dot`).
  Lien « Aller plus loin » depuis le bloc « En clair », et retour vers la
  notion depuis le cours.
  Même feuille de style, aucun `<style>` dans la page.
  Terminé quand : la page existe, les deux liens fonctionnent dans les deux
  sens, et elle se lit correctement en 390 px de large.
  **Ne fais cette page que pour le produit scalaire pour l'instant.** Elle sert
  de modèle ; les autres notions n'en auront que si le calendrier le permet.

- [x] **Page d'accueil en cartes, avec un aperçu dessiné par le moteur**
  Chaque notion devient une carte : une vignette (canvas figé montrant la
  notion dans une position parlante) + son titre + une phrase.
  Cela demande une **extension générique du moteur** : une fonction qui monte
  un module en mode aperçu — pas de drag, pas de panneau, pas de bouton, juste
  le dessin. Par exemple `monterApercu(notion, element)` dans `module.js`, ou
  une option `apercu: true` de `monterModule`. Le moteur ne doit toujours pas
  savoir quelle notion il dessine.
  Prévois le cas des notions pas encore écrites : carte grisée, sans vignette.
  Terminé quand : l'accueil montre une vignette réelle du produit scalaire, les
  cartes s'empilent proprement sur téléphone, et ajouter une notion à la liste
  ne demande qu'une ligne.

---

## Ticket 02 — Produit vectoriel (semaine du 26/08)

- [x] **Écrire `js/notions/produit-vectoriel.js`**
  Le moteur est en 2D : la notion traite donc le produit vectoriel **en 2D**,
  c'est-à-dire le scalaire `ax*by − ay*bx`. Ne construis pas de canvas 3D.
  Ce que la notion doit faire comprendre :
  - sa valeur absolue est **l'aire du parallélogramme** formé par A et B —
    dessine ce parallélogramme, ce n'est pas une aide au dessin, c'est le
    sujet lui-même ;
  - son **signe** donne l'orientation : positif si B est à gauche de A ;
  - il s'annule quand A et B sont **colinéaires**, là où le produit scalaire
    est au contraire maximal.
  Mentionne qu'en 3D le résultat est un vecteur perpendiculaire aux deux
  autres, et que ce scalaire en est la composante z.
  Terminé quand : deux vecteurs colinéaires donnent 0.00, et A=(1,0) B=(0,1)
  donne exactement 1.00.

- [x] **Créer `notions/produit-vectoriel.html` et son bloc « En clair »**
  Copie le gabarit du produit scalaire. Pour l'usage en jeu : savoir de quel
  côté tourner, calculer une normale, trier un ordre d'affichage.
  Terminé quand : la page se comporte comme celle du produit scalaire **sans
  qu'un seul fichier de `js/moteur/` ait été modifié**. C'est le test de
  l'architecture — si tu as dû toucher au moteur, dis-le.

- [x] **Ajouter la carte à l'accueil, déployer, tester sur téléphone**

---

## Ticket 03 — Interpolation linéaire (semaine du 26/08)

- [x] **Ajouter la gestion des curseurs au moteur**
  L'interpolation a besoin d'un paramètre `t` entre 0 et 1, donc d'un curseur.
  Extension **générique** et légitime : une notion déclare
  `curseurs: [{ id, min, max, pas, defaut, label }]`, le moteur les fabrique et
  les passe à `calculer` et `dessiner`. Le moteur ne sait toujours pas ce
  qu'est une interpolation.
  Terminé quand : les deux notions existantes fonctionnent encore à
  l'identique, sans curseur déclaré.

- [x] **Écrire `js/notions/interpolation-lineaire.js`, sa page et son bloc**
  `lerp(A, B, t) = A + (B − A) × t`. Montrer le point mobile sur le segment ;
  `t = 0` donne A, `t = 1` donne B, `t = 0.5` le milieu.
  Usage en jeu : `Vector3.Lerp`, faire suivre une caméra, adoucir un
  déplacement. Erreur classique : `Lerp` appelé chaque image avec le même `t`,
  qui n'atteint jamais vraiment la cible.
  Terminé quand : `t = 0.5` place le point exactement au milieu, vérifié à
  l'œil sur la grille.

- [x] **Carte, déploiement, test téléphone**

---

## Hors ticket — menu latéral et thème clair/sombre (26-28/08)

Travail réel fait en dehors de l'ordre du TODO, comme les pages de cours
avant lui — à garder tracé ici pour que la liste reflète l'état du projet.

- [x] **Menu latéral** (navigation entre les 3 notions, bascule thème
  clair/sombre, lien Soutenir), dans `js/site/menu.js` — nouveau dossier, ni
  moteur ni notion, justifié par un commentaire dans le fichier. Présent et
  cohérent sur les 7 pages (accueil, 3 notions, 3 cours) : mêmes liens, mêmes
  chemins relatifs, lien actif détecté correctement par `pathname`.

- [x] **Revue + test réel du site en ligne (28/08, Cowork)** — bascule de
  thème, affichage mobile 375px, console navigateur : aucune erreur, aucun
  bug trouvé sur ces points. Le canvas reste bien verrouillé sombre en thème
  clair sur le site déployé, comme prévu par `docs/univers.md`.

- [x] **Contraste du thème clair corrigé et en ligne.** `.bloc-titre`,
  `.code-inline`, `.en-clair-lien`, `.menu-liens a.actif`, `.menu-soutenir`
  utilisent désormais `--pos-texte`/`--vec-a-texte` (variantes adaptées au
  fond clair) au lieu de `--pos`/`--vec-a` directement. Vérifié dans
  `css/vectorium.css`. Au passage (28-29/08), bug similaire trouvé et
  corrigé sur `--neutral` (résultat proche de 0, cas « perpendiculaire ») :
  ajout de `--neutral-texte` sur le même principe.

- [x] **Palette claire revisitée : beige warm cohérent partout, canvas adapté
  au thème clair** (28/08) — Changement gris-bleu → beige warm pour harmonie
  visuelle. Retrait du verrouillage sombre de `.module`/`.apercu` : désormais
  les canvas interactifs suivent le thème clair. Grille et axes redéclarés
  pour chaque thème. Testé visuel OK sur accueil + 3 notions.

- [x] **Documenter `js/site/` dans `CLAUDE.md`**, section Architecture — elle
  ne mentionne encore que `js/moteur/` et `js/notions/`.

- Lien « Soutenir » (`href="#"`) : décision assumée, pas un bug — en attente
  d'un choix de plateforme (fiabilité Stripe/IBAN à revoir).

---

## Ticket 04 — Finaliser et intégrer la notion Matrices

- [x] **Reprendre `notions/matrices-test.html` sur le vrai gabarit** (28/08)
  Bannière brouillon retirée, menu latéral ajouté (avec les 3 autres pages
  mises à jour pour pointer vers Matrices), en-tête harmonisé
  (« NOTION 04 / MATRICES »). `notions/matrices-test.html` supprimé.
  Testé : angle = 90°, échelle = 1 donne bien un A' perpendiculaire à A.

- [x] **Ajouter la carte à l'accueil, déployer, tester sur téléphone.** (28/08)
  Carte + aperçu ajoutés à `index.html`, déployé sur GitHub Pages.

- [ ] **Page de cours `cours/matrices.html`** — seulement si le temps le
  permet, comme pour produit-vectoriel et interpolation-lineaire.

---

## Ticket 05 — Verdicts concrets sur produit scalaire et produit vectoriel

Constat (retour Cowork, 29/08) : le texte d'accroche et le bloc « En clair »
posent un scénario concret, mais le verdict affiché en direct pendant la
manipulation restait abstrait — l'utilisateur devait traduire lui-même ce
qu'il voyait vers le « pourquoi ça sert ».

- [x] **`js/notions/produit-scalaire.js`** — 3 verdicts réécrits (positif /
  négatif / perpendiculaire) autour du scénario de l'ennemi qui repère.
  Vérifié : verdict + couleur changent en direct pendant le drag.

- [x] **`js/notions/produit-vectoriel.js`** — 3 verdicts réécrits
  (antihoraire / horaire / colinéaires) autour du scénario « de quel côté
  tourner pour faire face à la cible ».

- [ ] **Tester sur téléphone** avant de merger.
  PR ouverte : https://github.com/HexoK2/Vectorium/pull/1 (pas encore
  mergée dans `main`).

---

## Semaine du 02/09 — consolidation

- [ ] **Faire tester le site par deux ou trois camarades de promo**
  Note chaque incompréhension dans `journal.md`. Ne corrige rien pendant le
  test, observe.
  *En cours* : premier retour reçu — comprend le mécanisme et trouve le
  visuel réussi, mais ne comprend toujours pas pourquoi on utilise le
  produit scalaire ni à quoi ça sert, malgré le bloc « En clair ».

- [ ] **Corriger ce que les tests ont révélé**, par ordre de gravité.

- [x] **Pages de cours pour les autres notions** — seulement s'il reste du
  temps après les corrections. Une notion sans page de cours reste utilisable :
  ne sacrifie pas les corrections pour ça.
  Faite en avance (avant les tests camarades) : décision assumée le 26/08.

- [ ] **Relire tout le code une dernière fois pour pouvoir l'expliquer.**
  Parcours chaque fichier avec l'auteur. Chaque bloc qu'il ne sait pas
  réexpliquer est à retravailler avant la présentation — c'est la tâche la plus
  importante de la semaine.

- [ ] **Compléter `journal.md`** : le tableau estimé / réel entier, et au moins
  trois constats honnêtes dans « ce qui a été appris », dont une estimation
  ratée.

- [ ] **GEL DU CODE — 07/09.** Après cette date, plus aucune fonctionnalité.
  Uniquement des corrections si quelque chose est cassé.

---

## Bonus — seulement si tout ce qui précède est fini et testé

- [ ] Transformer le site en PWA (manifest + service worker) pour l'icône sur
  l'écran d'accueil et l'ouverture en plein écran.

Ne commence pas ce bonus tant qu'une seule case au-dessus est décochée.

---

## À mentionner en démo, à ne PAS construire maintenant

- D'autres notions : courbes de Bézier, raycasting.
- Un coach adaptatif basé sur l'API Claude, qui expliquerait la notion
  différemment selon les erreurs de chacun.
