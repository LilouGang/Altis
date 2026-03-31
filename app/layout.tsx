import Header from "./shared/ui/Header";
import { AuthProvider } from "./shared/lib/AuthContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="h-screen w-screen overflow-hidden bg-neutral-900 antialiased">
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