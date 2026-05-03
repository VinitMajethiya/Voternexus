import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { PhaseProvider } from "@/components/layout/PhaseProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';
import { SwitchAccessProvider } from '@/providers/SwitchAccessProvider';

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VoterNexus | The Interactive Election Companion",
  description: "Empowering Indian voters through interactive education and real-time utilities.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VoterNexus",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A56DB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <AccessibilityProvider>
            <SwitchAccessProvider>
              <PhaseProvider>
                {children}
              </PhaseProvider>
            </SwitchAccessProvider>
          </AccessibilityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
