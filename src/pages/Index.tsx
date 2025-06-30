import { useState } from "react";
// CreditBail Pro - Module Tiers
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import StatsCard from "@/components/Dashboard/StatsCard";
import TiersTable from "@/components/Tiers/TiersTable";
import TiersForm from "@/components/Tiers/TiersForm";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Users, Building, Shield, AlertTriangle, Plus } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "tiers" | "form">("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "tiers":
        return <TiersTable />;
      case "form":
        return <TiersForm />;
      default:
        return (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Tiers"
                value="1,247"
                subtitle="Actifs dans le système"
                icon={<Users className="h-4 w-4" />}
                trend={{ value: "+12% ce mois", isPositive: true }}
              />
              <StatsCard
                title="Clients Actifs"
                value="892"
                subtitle="Avec contrats en cours"
                icon={<Building className="h-4 w-4" />}
                trend={{ value: "+8% ce mois", isPositive: true }}
              />
              <StatsCard
                title="Garants"
                value="156"
                subtitle="Validés et actifs"
                icon={<Shield className="h-4 w-4" />}
              />
              <StatsCard
                title="Risques Élevés"
                value="23"
                subtitle="Nécessitent un suivi"
                icon={<AlertTriangle className="h-4 w-4" />}
                trend={{ value: "-3 ce mois", isPositive: true }}
              />
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentView("form")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un nouveau tiers
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentView("tiers")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gérer les tiers existants
                  </Button>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Tiers Récents</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>SARL Technologies Plus</span>
                    <span className="text-muted-foreground">Aujourd'hui</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Martin Dupont</span>
                    <span className="text-muted-foreground">Hier</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Équipements Industriels SA</span>
                    <span className="text-muted-foreground">Il y a 2 jours</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Alertes</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Documents manquants</p>
                      <p className="text-muted-foreground">3 tiers en attente</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Validation en attente</p>
                      <p className="text-muted-foreground">1 dossier KYC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
              {currentView === "dashboard" && "Tableau de Bord"}
              {currentView === "tiers" && "Gestion des Tiers"}
              {currentView === "form" && "Nouveau Tiers"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {currentView === "dashboard" && "Vue d'ensemble de la gestion des tiers"}
              {currentView === "tiers" && "Gérez vos clients, fournisseurs et garants"}
              {currentView === "form" && "Créer un nouveau tiers dans le système"}
            </p>
          </div>
          
          {currentView !== "dashboard" && (
            <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
              Retour au tableau de bord
            </Button>
          )}
        </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
