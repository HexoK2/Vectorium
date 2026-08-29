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

## Ticket 04 — Finaliser et intégrer la notion Matrices (28-29/08)

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Reprendre `matrices-test.html` sur le vrai gabarit | 50 minutes | non capturé | Session déviée par un faux bug (le mode nuit du navigateur recolorait la page, pris pour un bug de thème) avant de revenir à la tâche — le compteur n'a pas été repris derrière |
| Page de cours `cours/matrices.html` | non estimé | non capturé | Faite dans la foulée du merge de la PR verdicts, pas de chrono posé avant de commencer |

À surveiller (même remarque que le 26/08) : plusieurs tâches de suite sans
temps réel capturé. La cause cette fois est différente — pas un oubli, mais
des interruptions (débogage cache navigateur, allers-retours sur la palette
claire) qui ont rendu le chrono peu significatif une fois la tâche reprise.

## Ticket 05 — Verdicts concrets produit scalaire / produit vectoriel (29/08)

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Réécriture des 6 verdicts + vérification + PR + merge | non estimé | non capturé | Ticket transmis par Cowork avec les 3 phrases du produit scalaire déjà rédigées ; seules celles du produit vectoriel ont demandé une proposition avant application |

## Ticket 06 — README à jour (29/08)

| Tâche | Estimé | Réel | Notes |
|-------|--------|------|-------|
| Feuille de route, Structure, Ajouter une notion, vérif liens | non estimé | non capturé | Contrat de notion repris tel quel depuis `CLAUDE.md`, pas réécrit ; commande locale corrigée (`python3` → `python`, cassait sur Windows) |
