# Control Plane

## Services à Connecter
- **GitHub**: Gérer les repositories des clients.
- **Firebase**: Supporter la gestion des applications.
- **Vercel ou Render**: Héberger les applications clientes.
- **Resend**: Gérer l'envoi d'emails.
- **Stripe**: Gérer les paiements pour les clients.

## Actions Autorisées pour Hermes
- Créer un repo client.
- Créer une branche.
- Créer une PR (Pull Request).
- Créer un projet d'hébergement sur Vercel ou Render.
- Ajouter des variables d'environnement nécessaires pour le fonctionnement.
- Lancer un build pour préparer le déploiement.
- Lancer un déploiement preview afin de valider avant la mise en production.
- Vérifier les logs de l'application pour le débogage.
- Préparer un domaine dans Resend pour l'envoi d'emails.
- Préparer un webhook Stripe pour gérer les interactions de paiement.

## Actions Interdites sans Validation Humaine
- Supprimer un projet dans GitHub.
- Supprimer une base de données dans Firebase.
- Supprimer un domaine dans Vercel/Render.
- Modifier les paramètres de billing.
- Supprimer ou régénérer des clés d'accès à des services.
- Déployer en production sans approbation.
- Modifier les secrets de production sans validation.
- Merger vers main sans approbation.

## Secrets
- Ne jamais stocker de secrets dans le dépôt.
- Ne jamais afficher les secrets dans les logs.
- Ne jamais inclure de secrets dans une réponse d'API.
- Stocker uniquement les secrets dans Vercel/Render/Firebase Secret Manager/GitHub Secrets.

## Rôles Minimum
- **GitHub**: Rôle Write, pas Admin.
- **Firebase**: Rôle Develop Admin ou un rôle custom limité.
- **Vercel/Render**: Rôle Developer.
- **Resend**: Rôle Developer/Admin selon les limites du service.
- **Stripe**: Rôle Developer.

## Futurs Endpoints du Control Plane
- `POST /clients` pour créer un nouveau client.
- `POST /clients/:id/firebase` pour connecter Firebase au client.
- `POST /clients/:id/hosting` pour configurer l'hébergement.
- `POST /clients/:id/resend` pour mettre en place Resend.
- `POST /clients/:id/stripe` pour intégrer Stripe.
- `POST /clients/:id/deploy-preview` pour préparer un déploiement de preview.
- `POST /clients/:id/deploy-production` pour déployer en production.
- `GET /clients/:id/status` pour récupérer l'état du client.
- `POST /clients/:id/rollback` pour effectuer un rollback.

## Première Phase
- Ne pas automatiser tout de suite.
- Créer d'abord les comptes techniques nécessaires.
- Tester tous les processus en staging.
- Limiter Hermes aux déploiements de preview.
- Garder la validation humaine pour tout déploiement en production.