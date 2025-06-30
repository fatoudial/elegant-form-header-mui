import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import TiersTable from "@/components/Tiers/TiersTable";
import TiersForm from "@/components/Tiers/TiersForm";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Plus, ArrowLeft } from "lucide-react";

const Tiers = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");

  const renderContent = () => {
    switch (currentView) {
      case "form":
        return <TiersForm />;
      default:
        return <TiersTable />;
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
                  {currentView === "list" ? "Gestion des Tiers" : "Nouveau Tiers"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {currentView === "list" 
                    ? "Gérez vos clients, fournisseurs et garants" 
                    : "Créer un nouveau tiers dans le système"
                  }
                </p>
              </div>
              
              <div className="flex gap-2">
                {currentView === "list" ? (
                  <Button onClick={() => setCurrentView("form")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Tiers
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setCurrentView("list")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la liste
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

export default Tiers;