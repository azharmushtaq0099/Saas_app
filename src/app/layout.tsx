import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { MockModeBootstrap } from "@/components/MockModeBootstrap";
import { AppUserProvider, type AppProfile } from "@/contexts/AppUserContext";
import { getEntitlementForUser } from "@/lib/entitlements";
import { isMockMode } from "@/lib/mock-mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Etsy Listing Generator + eBook",
  description:
    "Generate premium Etsy listings with AI and get the SaaS learning eBook.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialProfile: AppProfile | null = null;
  if (user) {
    const ent = await getEntitlementForUser(user.id);
    initialProfile = {
      id: user.id,
      email: user.email ?? null,
      is_pro: ent.is_pro,
      usage_count: ent.usage_count,
    };
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppUserProvider
          key={[
            initialProfile?.id ?? "anon",
            initialProfile?.is_pro ?? "f",
            initialProfile?.usage_count ?? "0",
          ].join(":")}
          initialProfile={initialProfile}
          isMockMode={isMockMode}
        >
          {isMockMode ? <MockModeBootstrap /> : null}
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <CookieConsent />
        </AppUserProvider>
        <Footer />
      </body>
    </html>
  );
}
