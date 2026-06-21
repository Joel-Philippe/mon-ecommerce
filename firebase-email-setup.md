# 📧 Configuration Email officielle — Resend

## 🎯 Solution retenue pour le template

Le template ecommerce utilise **Resend uniquement** pour les emails applicatifs actifs :

- confirmation de commande ;
- mises à jour de statut ;
- demandes spéciales ;
- emails de test/diagnostic.

Gmail SMTP, Outlook SMTP et `nodemailer` ne font plus partie du code actif du template.

## 1️⃣ Créer et vérifier le compte Resend

1. Créez un compte sur [resend.com](https://resend.com).
2. Ajoutez le domaine du client dans Resend.
3. Configurez les DNS demandés par Resend (SPF/DKIM/verification domaine).
4. Attendez que le domaine soit marqué comme vérifié.
5. Créez une clé API Resend côté serveur.

## 2️⃣ Variables d'environnement Next.js

Ajoutez ces valeurs dans `.env.local` en local, puis dans les variables d'environnement de l'hébergeur :

```env
RESEND_API_KEY=re_votre_cle_api_resend
RESEND_FROM_EMAIL=noreply@votre-domaine.com
RESEND_REPLY_TO_EMAIL=support@votre-domaine.com
```

Notes :

- `RESEND_API_KEY` est obligatoire et doit rester côté serveur.
- `RESEND_FROM_EMAIL` doit utiliser un domaine vérifié dans Resend.
- `RESEND_REPLY_TO_EMAIL` est optionnel mais recommandé pour le support client.
- `NEXT_PUBLIC_SUPPORT_EMAIL` reste l'email public affiché dans l'interface.

## 3️⃣ Firebase Functions

Si les Firebase Functions du dossier `functions/` sont utilisées, configurez Resend avec Firebase Functions config :

```bash
firebase functions:config:set \
  resend.api_key="re_votre_cle_api_resend" \
  resend.from_email="noreply@votre-domaine.com" \
  resend.reply_to_email="support@votre-domaine.com" \
  client.name="Votre Boutique"
```

Puis redéployez les functions :

```bash
firebase deploy --only functions
```

## 4️⃣ Vérification

- Lancez l'application en local.
- Configurez `RESEND_API_KEY` et `RESEND_FROM_EMAIL`.
- Utilisez la route ou l'écran de diagnostic email si présent.
- Vérifiez que Resend affiche l'email dans ses logs d'envoi.
- Testez le flux Stripe/webhook en environnement de test avant production.

## 5️⃣ Ancienne extension Firebase SMTP

Le fichier `extensions/firestore-send-email.env` peut encore exister comme référence historique/legacy, mais il n'est pas la solution officielle du template et ne doit pas être supprimé sans confirmation explicite.

Pour les nouveaux clients, configurez Resend plutôt que Gmail SMTP ou Outlook SMTP.

## 6️⃣ Coûts et limites

Consultez les tarifs et limites à jour sur [resend.com/pricing](https://resend.com/pricing). Le plan gratuit suffit souvent pour les premiers tests, mais chaque client doit vérifier ses besoins de volume et de domaine.