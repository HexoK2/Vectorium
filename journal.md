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
