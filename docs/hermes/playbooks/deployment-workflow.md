# Deployment Workflow

## Goal
Définir la procédure officielle qu'Hermes doit suivre avant, pendant et après un déploiement.

## Core Rules
- Ne jamais déployer sans validation humaine.
- Ne jamais modifier les secrets sans validation humaine.
- Ne jamais supprimer de ressource production.
- Toujours vérifier main propre.
- Toujours lancer build avant déploiement.
- Toujours vérifier Firebase, Stripe, Resend après déploiement.
- Ne jamais afficher les valeurs des variables d'environnement.
- Seulement afficher les noms et leur présence/absence.

## Required Human Approvals
1. Validation des changements requis avant chaque déploiement.
2. Approbation finale avant l'exécution du déploiement.

## Steps
### Step 1 - Sync Main
Vérifier que la branche principale est à jour.

### Step 2 - Verify Environment Inventory
Confirmer que l'environnement cible est configuré correctement.

### Step 3 - Check Required Environment Variables
S'assurer que toutes les variables d'environnement nécessaires sont définies.

### Step 4 - Run Production Build
Lancer le build de production pour vérifier les erreurs potentielles.

### Step 5 - Prepare Deployment
Préparer les ressources nécessaires pour l'opération de déploiement.

### Step 6 - Deploy
Effectuer le déploiement des modifications.

### Step 7 - Post-Deployment Checks
Vérifier l'état des services après le déploiement.

### Step 8 - Rollback Procedure
Procédure à suivre en cas d'échec du déploiement.

## Reporting Format
- Nom de la variable : présent/absent

## Forbidden Actions
- Suppression de toute ressource de production sans validation appropriée.
- Modification des secrets sans approbation humaine.