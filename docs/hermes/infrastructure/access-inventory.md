# Infrastructure Access Inventory

## GitHub

- Repository: Joel-Philippe/mon-ecommerce
- Default branch: main
- Protected branches: main, fastfood
- Pull Request workflow: required before merge

## Firebase

- Project: time-sigup
- Firebase Admin authentication: configured in /root/.hermes/.env
- Firebase Admin access verified: yes
- Firestore read access verified: yes
- Firestore: used
- Storage: used
- Authentication: used
- Client config: components/firebaseConfig.ts
- Admin config: utils/firebaseAdmin.ts

## Firebase Client Usage

- app/[id]/page.tsx
- app/page.tsx
- app/admin/page.tsx
- app/favorites/page.tsx
- components/AddCard.tsx
- components/CommentSection.tsx
- components/Messages.tsx
- components/UpdateCardModal.tsx
- components/GlobalCartContext.tsx

## Firebase Admin Usage

- app/api/add-order/route.ts
- app/api/admin/orders/route.ts
- app/api/admin/orders/[id]/route.ts
- app/api/admin/setup-market/route.ts
- app/api/cards/route.ts
- app/api/cards/[id]/route.ts
- app/api/cart/add/route.ts
- app/api/cart/clear/route.ts
- app/api/cart/get/route.ts
- app/api/cart/merge/route.ts
- app/api/cart/remove/route.ts
- app/api/cart/update/route.ts
- app/api/complete-purchase/route.ts
- app/api/create-payment-intent/route.ts
- app/api/favorites/toggle/route.ts
- app/api/my-orders/route.ts
- app/api/products/details/route.ts
- app/api/rate-product/route.ts
- app/api/release-stock/route.ts
- app/api/save-purchase/route.ts
- app/api/stripe-webhook/route.ts
- app/api/stripe/checkout-sessions/route.ts
- app/api/stripe/webhooks/route.ts
- utils/server-only-verifyFirebaseToken.ts

## Stripe

- Dashboard: UNKNOWN
- Webhooks: used
- Checkout Sessions route: app/api/stripe/checkout-sessions/route.ts
- Stripe webhooks route: app/api/stripe/webhooks/route.ts
- Legacy webhook route: app/api/stripe-webhook/route.ts
- Payment Intent route: app/api/create-payment-intent/route.ts
- Order details route: app/api/order-details/route.ts
- Release stock route: app/api/release-stock/route.ts
- Client Stripe usage:
  - app/cart/page.tsx
  - components/globalprice.tsx

## Resend

* Domains: 0 configured
* Authentication: RESEND_API_KEY configured in /root/.hermes/.env
* Access level verified: API access confirmed
* Domain management: available
* Email sending capability: available
* API test status: HTTP 200 verified
- Main API route: app/api/send-email/route.ts
- Test route: app/api/test-email/route.ts
- Debug route: app/api/debug-webhook/route.ts
- Service: utils/resendEmailService.ts
- Test page: app/test-resend/page.tsx
- Debug component: components/EmailDebugComponent.tsx

## Hosting

- Vercel: connected
- Vercel account: joel-philippe
- Vercel team/scope: philippes-projects-c7aa6646
- VERCEL_TOKEN: configured in /root/.hermes/.env
- Access level verified: read access to projects
- Vercel projects discovered:
  - philippe-studio
  - time
  - easy-gcly
  - easy-joq8
  - easy
- VPS: UNKNOWN
- OVH: available account, not connected to Hermes yet
- Render: connected
- RENDER_API_KEY: configured in /root/.hermes/.env
- Render API access verified: yes
- Render services count: 8
- Render services discovered:
  - fastfood-backend
  - fastfood-docker
  - habitat-jeunes-90
  - fastfood
  - mon-ecommerce
  - Render-ecommerce
  - quiz-backend
  - quiz-frontend
- Docker: not detected
- vercel.json: not detected
- Dockerfile: not detected
- docker-compose.yml: not detected

## Mobile

- Expo: not detected
- App Store: UNKNOWN
- Google Play: UNKNOWN
- eas.json: not detected
- app.json: not detected

## Known Environment Variables

Never store values here. Names only.

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- RESEND_REPLY_TO_EMAIL
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- NEXT_PUBLIC_DOMAIN
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_CLIENT_NAME
- NEXT_PUBLIC_CLIENT_TAGLINE
- NEXT_PUBLIC_CLIENT_DESCRIPTION
- NEXT_PUBLIC_SUPPORT_EMAIL
- NEXT_PUBLIC_SUPPORT_PHONE
- NEXT_PUBLIC_EMAIL_FROM_NAME
- NODE_ENV

## Human Approval Required

Hermes must always request human approval before:

- modifying secrets
- rotating API keys
- deleting Firebase data
- deleting Stripe webhooks
- changing billing settings
- changing deployment settings
- merging into main
- merging into fastfood
- deleting production resources
- pushing directly to protected branches