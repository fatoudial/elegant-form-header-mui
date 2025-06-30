import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FileText, Plus, Calendar, Users, Euro } from "lucide-react";

const Contrats = () => {
  const contrats = [
    {
      id: "CTR-001",
      client: "SARL Technologies Plus",
      type: "Location",
      montant: "45 000 €",
      dateDebut: "01/03/2024",
      dateFin: "01/03/2027",
      statut: "Actif",
      statutColor: "bg-green-500"
    },
    {
      id: "CTR-002", 
      client: "Équipements Industriels SA",
      type: "Crédit-bail",
      montant: "120 000 €",
      dateDebut: "15/01/2024",
      dateFin: "15/01/2029",
      statut: "Actif",
      statutColor: "bg-green-500"
    },
    {
      id: "CTR-003",
      client: "Martin Dupont",
      type: "Location",
      montant: "25 000 €",
      dateDebut: "10/02/2024",
      dateFin: "10/02/2026",
      statut: "En attente",
      statutColor: "bg-orange-500"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestion des Contrats</h1>
                <p className="text-muted-foreground mt-2">
                  Gérez vos contrats de crédit-bail et de location
                </p>
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Contrat
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Contrats</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Actifs</p>
                      <p className="text-2xl font-bold">134</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">En attente</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Euro className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valeur totale</p>
                      <p className="text-2xl font-bold">2.4M €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des contrats */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des Contrats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contrats.map((contrat) => (
                    <div key={contrat.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{contrat.id}</p>
                          <p className="text-sm text-muted-foreground">{contrat.client}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{contrat.type}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Montant</p>
                          <p className="font-medium">{contrat.montant}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Période</p>
                          <p className="font-medium">{contrat.dateDebut} - {contrat.dateFin}</p>
                        </div>
                        <Badge className={`${contrat.statutColor} text-white`}>
                          {contrat.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contrats;