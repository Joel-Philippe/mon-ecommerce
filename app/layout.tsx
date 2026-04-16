import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "./video-banner.css";
import "./style.css";
import "@/components/BottomNav.css";

import BottomNavWrapper from "@/components/BottomNavWrapper";
import FloatingBackButtonWrapper from "@/components/FloatingBackButtonWrapper";
import ProgressBar from "@/components/ProgressBar";
import ScrollRestoration from "@/components/ScrollRestoration";

export const metadata: Metadata = {
  title: "Family Market",
  description: "Market de quartier",
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
