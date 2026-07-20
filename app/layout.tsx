import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "./video-banner.css";
import "./style.css";
import "@/components/BottomNav.css";

import BottomNavWrapper from "@/components/BottomNavWrapper";
import FloatingBackButtonWrapper from "@/components/FloatingBackButtonWrapper";
import ProgressBar from "@/components/ProgressBar";
import ScrollRestoration from "@/components/ScrollRestoration";
import { clientConfig } from "@/config/client.config";

export const metadata: Metadata = {
  title: clientConfig.brandName,
  description: clientConfig.description,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf3f1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <ProgressBar />
        <ScrollRestoration />
        <Providers>
          <FloatingBackButtonWrapper />
          {children}
          <BottomNavWrapper />
        </Providers>
      </body>
    </html>
  );
}
