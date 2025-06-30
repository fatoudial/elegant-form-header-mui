
import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import PropositionsTable from "@/components/Propositions/PropositionsTable";
import PropositionForm from "@/components/Propositions/PropositionForm";
import PropositionsDashboard from "@/components/Propositions/PropositionsDashboard";
import PropositionDetails from "@/components/Propositions/PropositionDetails";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Plus, ArrowLeft, BarChart3 } from "lucide-react";

const Propositions = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "list" | "form" | "details">("dashboard");
  const [selectedPropositionId, setSelectedPropositionId] = useState<string | null>(null);

  const handleViewProposition = (propositionId: string) => {
    setSelectedPropositionId(propositionId);
    setCurrentView("details");
  };

  const renderContent = () => {
    switch (currentView) {
      case "form":
        return <PropositionForm />;
      case "list":
        return <PropositionsTable onViewProposition={handleViewProposition} />;
      case "details":
        return (
          <PropositionDetails 
            propositionId={selectedPropositionId!}
            onBack={() => setCurrentView("list")}
          />
        );
      default:
        return <PropositionsDashboard onViewChange={setCurrentView} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "form":
        return "Nouvelle Proposition";
      case "list":
        return "Gestion des Propositions";
      case "details":
        return `Détails Proposition ${selectedPropositionId}`;
      default:
        return "Tableau de Bord Propositions";
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case "form":
        return "Créer une nouvelle proposition de financement";
      case "list":
        return "Gérez vos propositions de financement leasing";
      case "details":
        return "Consultation et modification de la proposition";
      default:
        return "Vue d'ensemble des propositions et activités";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {getTitle()}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {getSubtitle()}
                </p>
              </div>
              
              <div className="flex gap-2">
                {currentView === "dashboard" && (
                  <>
                    <Button variant="outline" onClick={() => setCurrentView("list")}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Voir la liste
                    </Button>
                    <Button onClick={() => setCurrentView("form")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Proposition
                    </Button>
                  </>
                )}
                {currentView === "list" && (
                  <>
                    <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </Button>
                    <Button onClick={() => setCurrentView("form")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Proposition
                    </Button>
                  </>
                )}
                {(currentView === "form" || currentView === "details") && (
                  <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au tableau de bord
                  </Button>
                )}
              </div>
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Propositions;
