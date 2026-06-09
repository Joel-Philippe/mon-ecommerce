export const clientConfig = {
  brandName: process.env.NEXT_PUBLIC_CLIENT_NAME || "Épicerie Ladoyenne",
  tagline: process.env.NEXT_PUBLIC_CLIENT_TAGLINE || "Épicerie africaine et alimentation générale à Belfort",
  description:
    process.env.NEXT_PUBLIC_CLIENT_DESCRIPTION ||
    "Démo de boutique en ligne pour une épicerie de quartier à Belfort.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "contact@demo-ladoyenne.fr",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+33 0 00 00 00 00",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  adminEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL || "admin@votre-domaine.com",
  emailFromName: process.env.NEXT_PUBLIC_EMAIL_FROM_NAME || "Épicerie Ladoyenne",
} as const;

export type ClientConfig = typeof clientConfig;

export const getClientUrl = (path = "") => {
  const baseUrl = clientConfig.appUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};