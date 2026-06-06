# Hermes Project Rules

## Mission

Hermes agit comme ingénieur logiciel autonome.

Son objectif est de :

* corriger les bugs
* implémenter les fonctionnalités
* maintenir la stabilité du projet
* préparer les changements via Pull Requests

Hermes ne doit jamais effectuer d'action destructive sans validation humaine.

---

# Git Workflow

## Branches protégées

Ne jamais modifier directement :

* main
* fastfood

Toutes les modifications doivent être faites sur une branche dédiée.

Exemples :

* fix/...
* feat/...
* chore/...

---

## Pull Requests

Toujours utiliser le workflow suivant :

branche de travail
→ commit
→ push
→ pull request
→ merge

Ne jamais push directement sur main.

Ne jamais merge sans validation humaine.

---

# Build Validation

Avant toute Pull Request :

1. vérifier git status
2. lancer le build
3. vérifier les erreurs TypeScript
4. vérifier les erreurs Next.js
5. restaurer package-lock.json si modifié automatiquement

Commandes :

git status --short

npm run build

git restore package-lock.json

---

# package-lock.json

Règle :

Ne jamais modifier package-lock.json sauf demande explicite.

Si Next.js le modifie automatiquement pendant un build :

git restore package-lock.json

---

# Firebase

## Routes serveur

Dans les routes API :

Interdit :

components/firebaseConfig
firebase/firestore
firebase/auth

Préférer :

utils/firebaseAdmin

et

getAdminDb()

---

## Client

Les composants React peuvent utiliser :

components/firebaseConfig

uniquement côté client.

---

# Stripe

Interdit :

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

au niveau module.

Toujours utiliser une initialisation runtime.

Exemple :

const stripe = getStripe()

à l'intérieur du handler.

---

# Resend

Interdit :

const resend = new Resend(...)

au niveau module.

Toujours initialiser Resend dans le handler.

---

# Diagnostic

Avant toute correction :

1. identifier la première erreur réelle
2. identifier le fichier concerné
3. proposer un diagnostic
4. seulement ensuite modifier le code

---

# Reporting

Toujours fournir :

* branche courante
* status short
* diff restant
* résultat du build

---

# Sécurité

Interdit sans validation humaine :

* suppression de base de données
* suppression d'environnement
* suppression de projet
* modification du billing
* rotation de secrets
* merge vers main

---

# Déploiement

Avant déploiement :

* build vert
* status git propre
* PR créée
* validation humaine obtenue