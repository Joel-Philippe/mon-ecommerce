export const clientConfig = {
  brandName: process.env.NEXT_PUBLIC_CLIENT_NAME || "Votre Boutique",
  tagline: process.env.NEXT_PUBLIC_CLIENT_TAGLINE || "Votre boutique en ligne",
  description:
    process.env.NEXT_PUBLIC_CLIENT_DESCRIPTION ||
    "Base ecommerce générique pour commerces locaux.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@votre-domaine.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+33 0 00 00 00 00",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  adminEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL || "admin@votre-domaine.com",
  emailFromName: process.env.NEXT_PUBLIC_EMAIL_FROM_NAME || "Votre Boutique",
} as const;

export type ClientConfig = typeof clientConfig;

export const getClientUrl = (path = "") => {
  const baseUrl = clientConfig.appUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};
