# Journal de développement — Vectorium

## Ticket 01 — Mise en ligne

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Prototype (moteur générique + produit scalaire) | 2-3 jours | ✅ Fait | Design appliqué, tests téléphone OK |
| Commit de nettoyage (suppression moteur) | — | — | |
| README complété | — | — | URL GitHub Pages ajoutée, feuille de route mise à jour |
| Test sur téléphone | — | ✅ OK | Accueil, notion, drag, interactions — tout marche |

## Ticket 02 — Produit vectoriel

À remplir…

## Portage vers l'architecture moteur/notion (retour arrière assumé)

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Restaurer le moteur, porter les 3 notions, ajouter les curseurs, nettoyer les fichiers obsolètes | — | ~1 journée | Retour à l'architecture `js/moteur/` + `js/notions/` après le passage éclair par des pages autonomes ; ajout du contrat `curseurs` (générique, pas propre à l'interpolation) |

## Semaine du 26/08 — bloc « En clair »

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Bloc « En clair » sous le canvas (produit scalaire) | 1 heure | 30 minutes | Testé d'abord sur une page à part, validé sur téléphone, puis appliqué à la vraie page ; ajustement de la taille du résultat principal (40px → 30px) au passage |
| Page de cours `cours/produit-scalaire.html` | non estimé | — | À surveiller : plusieurs tâches de suite sans estimation, ça vide le tableau de son intérêt pour le tuteur |
| Accueil en cartes + vignette (`monterApercu`) | non estimé | 30 minutes max | Testé sur téléphone : vignettes, clic, carte fantôme distincte |

## Premier retour utilisateur (test informel, hors promo)

Testeur : un proche, sans connaissances particulières dans le domaine.

> « Pas mal du tout. Il faudrait ajouter un petit texte en intro qui explique
> la motivation de ce site et ce que le lecteur en tirera. »

Incompréhension révélée : l'accueil montre les notions mais n'explique pas
pourquoi le site existe ni ce qu'on en retire — à corriger sur `index.html`.

Correction (uniformisation interpolation + texte d'intro sur l'accueil) :
implémentation 2 minutes pour le texte d'intro — reste à voir si ça répond
vraiment au retour une fois validé par le testeur, dans deux jours.

## Exploration hors TODO — matrices, bloc erreur, animations concrètes

Notion « matrices » (rotation + échelle) ajoutée en test, avec un bloc erreur
interactif (curseur qui simule la confusion degrés/radians, résultat buggé
affiché en fantôme) et une animation illustrant chaque notion officielle
(balle+lerp, regard d'ennemi, cible en orbite) — pas encore fusionnées dans
les vraies pages, en attente de validation.

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Pages de cours produit-vectoriel + interpolation-lineaire | non estimé | 1 heure | Faites en avance sur l'ordre du TODO, décision assumée |

## Revue Cowork (27/08) — Suite : finition thème clair

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Réviser palette mode clair (beige warm cohérent avec téléphone) | — | 45 min | Changement gris-bleu → beige warm pour cohérence visuelle page/canvas |
| Adapter canvas interactifs au thème clair (+ grille/axes) | — | 15 min | Retrait du verrouillage sombre `.module`/`.apercu`, redéclaration des variables en mode clair |
| **Total ajusté thème clair** | — | 1 heure | Palette stable, testée sur accueil + 3 notions |
