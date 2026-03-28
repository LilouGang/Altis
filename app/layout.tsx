// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header"; // Remplacé !

export const metadata: Metadata = {
  title: "Altis",
  description: "Le carnet d'alpinisme minimaliste",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* On passe en flex-col pour empiler le Header et la Page */}
      <body className="flex flex-col w-full h-screen overflow-hidden bg-neutral-50 text-neutral-900 font-sans antialiased">
        
        <Header />

        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>

      </body>
    </html>
  );
}