# 🔒 Base Ecommerce - Plateforme e-commerce sécurisée

## 🚀 Installation et Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` avec vos clés de configuration :

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# Domain Configuration
NEXT_PUBLIC_DOMAIN=https://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=votre_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_firebase_app_id

# Email Configuration (server only)
EMAIL_SERVICE=hotmail
EMAIL_USER=votre_email@example.com
EMAIL_PASS=votre_mot_de_passe_email
```

### 3. Configuration SSL pour le développement local

```bash
# Installer mkcert et créer l'autorité de certification
npm run install-mkcert

# Générer les certificats SSL pour localhost
npm run setup-ssl
```

**Important** : Les certificats générés (`localhost.pem` et `localhost-key.pem`) doivent être dans le répertoire racine du projet.

### 4. Démarrage de l'application

```bash
# Démarrage en mode développement (HTTP)
npm run dev

# Démarrage en mode développement sécurisé (HTTPS)
npm run dev:https
```

L'application sera accessible sur :
- **HTTP** : [http://localhost:3000](http://localhost:3000)
- **HTTPS** : [https://localhost:3000](https://localhost:3000)

## 🔐 Résolution du Problème d'Autocomplétion

### Problème
Le message "La saisie automatique des modes de paiement est désactivé car la connexion utilisé par ce formulaire n'est pas sécurisée" apparaît lors de la saisie des informations de carte bancaire.

### Cause
Les navigateurs modernes (Chrome, Firefox, Safari) exigent une connexion HTTPS pour :
- L'autocomplétion des cartes bancaires
- La sauvegarde des informations de paiement
- Les fonctionnalités de sécurité avancées de Stripe

### Solution
1. **Générer les certificats SSL** :
   ```bash
   npm run install-mkcert
   npm run setup-ssl
   ```

2. **Démarrer en mode HTTPS** :
   ```bash
   npm run dev:https
   ```

3. **Accéder à l'application** :
   - Ouvrir [https://localhost:3000](https://localhost:3000)
   - Accepter le certificat auto-signé si demandé

### Vérification
✅ L'icône de cadenas doit apparaître dans la barre d'adresse  
✅ L'autocomplétion des cartes bancaires fonctionne  
✅ Stripe Elements affiche correctement les champs sécurisés  

## 🔐 Fonctionnalités de Sécurité

### ✅ Paiements Sécurisés avec Stripe
- **SSL/TLS obligatoire** : Connexion chiffrée pour tous les paiements
- **Stripe Elements** : Champs de carte bancaire sécurisés et conformes PCI DSS
- **Tokenisation** : Aucune donnée de carte stockée sur nos serveurs
- **3D Secure** : Authentification forte pour les paiements européens
- **Webhooks sécurisés** : Vérification des signatures pour les événements Stripe

### ✅ Gestion de Stock en Temps Réel
- **Vérification atomique** : Stock vérifié et réservé avant le paiement
- **Transactions sécurisées** : Utilisation de Firebase Transactions
- **Rollback automatique** : Libération du stock en cas d'échec de paiement
- **Prévention de survente** : Impossible d'acheter plus que le stock disponible

### ✅ Interface Utilisateur Moderne
- **Design responsive** : Compatible mobile, tablette et desktop
- **Animations premium** : Effets visuels avancés avec CSS et Framer Motion
- **Feedback temps réel** : Indicateurs de statut et messages d'erreur clairs
- **Accessibilité** : Interface conforme aux standards WCAG

## 🛡️ Architecture de Sécurité

### Chiffrement et Transport
- **TLS 1.3** : Protocole de chiffrement le plus récent
- **HSTS** : Sécurité de transport HTTP stricte
- **CSP** : Politique de sécurité du contenu
- **CORS** : Configuration sécurisée des origines croisées

### Validation et Sanitisation
- **Validation côté client** : Vérification immédiate des données
- **Validation côté serveur** : Double vérification pour la sécurité
- **Sanitisation** : Nettoyage des données d'entrée
- **Protection XSS** : Échappement automatique des données

### Gestion des Sessions
- **Firebase Auth** : Authentification sécurisée
- **JWT Tokens** : Tokens signés et vérifiés
- **Expiration automatique** : Sessions limitées dans le temps
- **Révocation** : Possibilité d'invalider les sessions

## 📱 Fonctionnalités Principales

### 🛒 E-commerce
- **Catalogue produits** : Affichage dynamique avec filtres
- **Panier intelligent** : Gestion automatique des stocks
- **Checkout sécurisé** : Processus de paiement en 2 étapes
- **Historique commandes** : Suivi des achats précédents

### 👤 Gestion Utilisateur
- **Inscription/Connexion** : Système d'authentification complet
- **Profil utilisateur** : Gestion des informations personnelles
- **Adresses de livraison** : Sauvegarde des adresses fréquentes
- **Préférences** : Personnalisation de l'expérience

### 📊 Administration
- **Gestion des stocks** : Mise à jour en temps réel
- **Suivi des ventes** : Statistiques et analytics
- **Gestion des commandes** : Traitement et suivi
- **Configuration** : Paramètres de l'application

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrage en HTTP (port 3000)
npm run dev:https    # Démarrage en HTTPS (port 3000)

# Production
npm run build        # Construction de l'application
npm run start        # Démarrage en mode production

# Outils
npm run lint         # Vérification du code
npm run setup-ssl    # Génération des certificats SSL
```

## 🚨 Dépannage

### Problème : "La saisie automatique des modes de paiement est désactivée"
**Cause** : Connexion non sécurisée (HTTP au lieu de HTTPS)
**Solution** : 
```bash
npm run setup-ssl
npm run dev:https
```

### Problème : Certificat SSL non reconnu
**Cause** : Autorité de certification non installée
**Solution** :
```bash
mkcert -install
```

### Problème : Erreur de connexion Stripe
**Cause** : Clés API incorrectes ou manquantes
**Solution** : Vérifiez vos clés dans `.env.local`

### Problème : Erreur Firebase
**Cause** : Configuration Firebase incorrecte
**Solution** : Vérifiez la configuration dans `.env.local`

## 🌐 Déploiement

### Vercel (Recommandé)
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Variables d'environnement en production
Configurez les mêmes variables que `.env.local` dans votre plateforme de déploiement.

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@votre-domaine.com
- 📱 Téléphone : +33 1 23 45 67 89
- 💬 Chat : Disponible sur le site web

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**⚠️ Important** : Assurez-vous toujours d'utiliser HTTPS en production pour garantir la sécurité des paiements et des données utilisateur.