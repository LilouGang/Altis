import SummitDetail from "@/features/summits/SummitDetail";

// 1. On précise que params est une Promesse (Promise<{ id: string }>)
// 2. On ajoute 'async' devant la fonction
export default async function PageSommet({ params }: { params: Promise<{ id: string }> }) {
  
  // 3. On "déballe" les paramètres de l'URL avant de les utiliser
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 px-6">
      {/* On passe l'ID de manière sécurisée au composant client */}
      <SummitDetail summitId={resolvedParams.id} />
    </div>
  );
}