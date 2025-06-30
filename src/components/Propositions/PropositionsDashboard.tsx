
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calculator,
  Eye
} from "lucide-react";

interface PropositionsDashboardProps {
  onViewChange: (view: "dashboard" | "list" | "form") => void;
}

const PropositionsDashboard = ({ onViewChange }: PropositionsDashboardProps) => {
  const stats = [
    {
      title: "Total Propositions",
      value: "247",
      subtitle: "Ce mois",
      icon: FileText,
      trend: { value: "+15%", isPositive: true },
      color: "text-blue-500"
    },
    {
      title: "En Attente",
      value: "32",
      subtitle: "À traiter",
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "Validées",
      value: "189",
      subtitle: "Approuvées",
      icon: CheckCircle,
      trend: { value: "+8%", isPositive: true },
      color: "text-green-500"
    },
    {
      title: "Refusées",
      value: "26",
      subtitle: "Non conformes",
      icon: XCircle,
      color: "text-red-500"
    }
  ];

  const recentPropositions = [
    {
      id: "PROP-2024-045",
      client: "SARL BatiPro",
      montant: 150000,
      statut: "En attente d'avis",
      commercial: "Sophie Martin",
      date: "Aujourd'hui"
    },
    {
      id: "PROP-2024-044",
      client: "TechnoServices SA",
      montant: 85000,
      statut: "Validée",
      commercial: "Pierre Dubois",
      date: "Hier"
    },
    {
      id: "PROP-2024-043",
      client: "Transport Express",
      montant: 220000,
      statut: "En cours",
      commercial: "Marie Lambert",
      date: "Il y a 2 jours"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "En attente d'avis":
        return "bg-yellow-100 text-yellow-800";
      case "Validée":
        return "bg-green-100 text-green-800";
      case "Refusée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche rapide */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Recherche rapide par client, numéro de proposition..."
                className="pl-10"
              />
            </div>
            <Button onClick={() => onViewChange("list")}>
              Recherche avancée
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <p className="text-sm font-medium">{stat.title}</p>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{stat.subtitle}</span>
                  {stat.trend && (
                    <span className={`flex items-center ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend.value}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              onClick={() => onViewChange("form")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Nouvelle Proposition
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onViewChange("list")}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher Propositions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Simulateur Rapide
            </Button>
          </CardContent>
        </Card>

        {/* Propositions récentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Propositions Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPropositions.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{prop.client}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{prop.id}</span>
                      <span>•</span>
                      <span>{prop.commercial}</span>
                      <span>•</span>
                      <span>{prop.montant.toLocaleString("fr-FR")} €</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(prop.statut)}>
                      {prop.statut}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onViewChange("list")}
            >
              Voir toutes les propositions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes et Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">5 propositions nécessitent votre avis</p>
                <p className="text-muted-foreground">Délai de traitement dépassé</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">3 nouvelles propositions à traiter</p>
                <p className="text-muted-foreground">Reçues dans les dernières 24h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropositionsDashboard;
