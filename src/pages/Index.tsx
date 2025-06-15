
// Page d'accueil avec l'entête moderne et élégante PME

import HeaderPME from "@/components/HeaderPME";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2">
      <div className="w-full max-w-3xl">
        <HeaderPME />
        {/* Reste du contenu ou du formulaire ici : */}
        <div className="bg-white rounded-b-2xl shadow-lg px-10 pt-12 pb-14 border-t-0 border border-border">
          <p className="text-lg text-muted-foreground text-center">
            Commencez à remplir le formulaire pour évaluer votre entreprise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
