import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarSection from "../components/sections/NavbarSection";
import FooterSection from "../components/sections/FooterSection";
import { LanguageProvider } from "../utils/LanguageContext";
import { SessionProviderContext } from "@/utils/SessionProviderContext";
import MotionProvider from "@/utils/MotionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataFlow",
  description: "Data analysis for eshop data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionProviderContext>
      <LanguageProvider>
        <html lang="lt">
          <body className={inter.className}>
            <div className="flex flex-col bg-white min-h-screen">
              <NavbarSection />
              <MotionProvider>
                <div className="context flex-grow">{children}</div>
              </MotionProvider>
            </div>
            <FooterSection />
          </body>
        </html>
      </LanguageProvider>
    </SessionProviderContext>
  );
}
