# Control Plane Hermes V1

## Goal
Définir la première version concrète du control plane Hermes, permettant la création de clients dans Firestore pour servir de base à l'automatisation future.

## Scope of V1
- Créer un client dans Firestore.

## Out of Scope
- Création automatique de projets Vercel, Render, Firebase, Resend ou Stripe.
- Déploiement de tout service.
- Modification de configurations existantes pour Stripe, Resend, Vercel ou Render.

## Endpoint
**POST** `/api/hermes/clients`

## Request Body
```json
{
  "name": "string",
  "email": "string",
  "status": "draft",
  "integrations": {
    "firebase": "pending",
    "vercel": "pending",
    "render": "pending",
    "resend": "pending",
    "stripe": "pending"
  }
}
```

## Firestore Collection
- **hermes_clients**

## Firestore Document Shape
```json
{
  "name": "string",
  "email": "string",
  "status": "draft",
  "integrations": {
    "firebase": "pending",
    "vercel": "pending",
    "render": "pending",
    "resend": "pending",
    "stripe": "pending"
  }
}
```

## Validation Rules
- Le champ `name` doit être une chaîne non vide.
- Le champ `email` doit être un email valide.

## Security Rules
- Les utilisateurs doivent avoir les autorisations nécessaires pour écrire dans la collection `hermes_clients`.

## Human Approval Required
- Tous les nouveaux clients doivent passer par un processus de validation humaine avant d'être considérés comme actifs.

## Future Steps
- Intégration avec des services externes tels que Vercel, Render, Firebase, Resend et Stripe dans les versions futures.