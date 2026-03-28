// src/app/layout.tsx
import Header from "@/shared/ui/Header";
import "./globals.css"; // Ton fichier CSS global

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="h-screen w-screen overflow-hidden bg-neutral-900 antialiased">
        <Header />
        {/* Le contenu de la page (la carte, le dashboard, etc.) s'affichera ici */}
        <main className="h-full w-full">
          {children}
        </main>
      </body>
    </html>
  );
}