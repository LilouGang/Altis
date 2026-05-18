import Header from "./shared/ui/Header";
import { AuthProvider } from "./shared/lib/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Altis - Carnet d'Alpinisme",
  description: "Enregistrez vos sommets, suivez vos statistiques.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#059669", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="h-dvh w-screen overflow-hidden bg-neutral-900 antialiased">
        <AuthProvider>
          <Header />
          <main className="h-full w-full overflow-y-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}