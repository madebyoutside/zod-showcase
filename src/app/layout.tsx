import type { Metadata } from "next";
import { Toaster } from "sonner";

import { appConfig } from "@/config/app-config";

import "@/assets/styles/main.css";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: appConfig.name,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-neutral-900">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
