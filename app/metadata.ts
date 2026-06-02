// app/metadata.ts
import type { Metadata } from "next";
import { clientConfig } from "@/config/client.config";

export const metadata: Metadata = {
  title: clientConfig.brandName,
  description: clientConfig.description,
};
