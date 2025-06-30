import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Send, 
  Edit, 
  FileText, 
  User, 
  Building, 
  Calculator,
  Package,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { usePropositionActions } from "@/hooks/usePropositionActions";
import QuickSimulator from "./QuickSimulator";

interface PropositionDetailsProps {
  propositionId: string;
  onBack: () => void;
}

const PropositionDetails = ({ propositionId, onBack }: PropositionDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview");
  const { saveAsDraft, sendForValidation, isLoading } = usePropositionActions();

  // Données mockées avec noms sénégalais et montants en FCFA
  const proposition = {
    id: "PROP-2024-045",
    client: "SARL Diallo & Frères",
    commercial: "Aissatou Ndiaye",
    montant: 90000000, // 90 millions FCFA
    statut: "En attente d'avis",
    dateCreation: "15/01/2024",
    objetFinance: "Matériel agricole",
    agence: "Dakar Plateau",
    codeProduit: "CB",
    duree: 36,
    tauxTEG: 8.75,
    loyerMensuel: 2750000, // 2.75 millions FCFA
    fournisseur: "Babacar Equipements SA"
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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

  const handleSaveAsDraft = async () => {
    try {
      await saveAsDraft(proposition);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleSendForValidation = async () => {
    try {
      await sendForValidation(proposition);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* En-tête de la proposition */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">{proposition.id}</CardTitle>
                <p className="text-muted-foreground">{proposition.client}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(proposition.statut)}>
                {proposition.statut}
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Annuler" : "Modifier"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Montant financé</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(proposition.montant)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Loyer mensuel</p>
              <p className="text-xl font-semibold">
                {formatCurrency(proposition.loyerMensuel)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">TEG</p>
              <p className="text-xl font-semibold">{proposition.tauxTEG}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulateur rapide en vue d'ensemble */}
      <QuickSimulator />

      {/* Informations principales avec noms sénégalais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Client</Label>
              <p className="font-medium">{proposition.client}</p>
            </div>
            <div>
              <Label>Commercial</Label>
              <p>{proposition.commercial}</p>
            </div>
            <div>
              <Label>Agence</Label>
              <p>{proposition.agence}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Objet Financé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Désignation</Label>
              <p className="font-medium">{proposition.objetFinance}</p>
            </div>
            <div>
              <Label>Fournisseur</Label>
              <p>{proposition.fournisseur}</p>
            </div>
            <div>
              <Label>Code produit</Label>
              <p>{proposition.codeProduit} - Crédit-bail</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border-l-2 border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Proposition créée</p>
                <p className="text-muted-foreground">15/01/2024 à 14:30 par Aissatou Ndiaye</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border-l-2 border-blue-500 bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Envoyée pour validation</p>
                <p className="text-muted-foreground">15/01/2024 à 16:15 par Aissatou Ndiaye</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border-l-2 border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">En attente d'avis</p>
                <p className="text-muted-foreground">Depuis le 16/01/2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informations Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nom">Nom / Raison sociale *</Label>
            <Input 
              defaultValue="SARL Diallo & Frères" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input 
              defaultValue="Mamadou Diallo" 
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input 
              defaultValue="77 123 45 67" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="siret">NINEA</Label>
            <Input 
              defaultValue="12345678901234" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="secteur">Secteur d'activité</Label>
            <Select disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Agriculture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="adresse">Adresse complète *</Label>
          <Textarea 
            defaultValue="Médina, Rue 15 x 20, Dakar, Sénégal" 
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderObjetTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Objet Financé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference">Référence objet *</Label>
            <Input 
              defaultValue="MAT-AGR-2024-001" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="designation">Désignation *</Label>
            <Input 
              defaultValue="Matériel agricole" 
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="montantHT">Montant HT (FCFA) *</Label>
            <Input 
              type="number" 
              defaultValue="76271186" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="tva">TVA (%)</Label>
            <Input 
              type="number" 
              defaultValue="18" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="montantTTC">Montant TTC (FCFA)</Label>
            <Input 
              type="number" 
              defaultValue="90000000" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="etat">État matériel</Label>
            <Select disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Neuf" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neuf">Neuf</SelectItem>
                <SelectItem value="occasion">Occasion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fournisseur">Fournisseur *</Label>
            <Input 
              defaultValue="Babacar Equipements SA" 
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="livraison">Date de livraison</Label>
            <Input 
              type="date" 
              defaultValue="2024-03-15" 
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBaremesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Barèmes et Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="periodicite">Périodicité *</Label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Mensuelle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="terme">Terme (mois) *</Label>
              <Input 
                type="number" 
                defaultValue="36" 
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="taux">Taux (%)</Label>
              <Input 
                type="number" 
                step="0.01" 
                defaultValue="7.50" 
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="valeurResiduelle">Valeur résiduelle (%)</Label>
              <Input 
                type="number" 
                step="0.01" 
                defaultValue="2.00" 
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-3">Résultats de simulation</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Loyer mensuel HT :</span>
                <span className="font-medium">{formatCurrency(2750000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total des loyers :</span>
                <span className="font-medium">{formatCurrency(99000000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Coût total :</span>
                <span className="font-medium">{formatCurrency(101000000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux effectif global :</span>
                <span className="font-medium">8.75 %</span>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <Button className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Recalculer la simulation
            </Button>
          )}
        </CardContent>
      </Card>

      <QuickSimulator />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Retour à la liste
        </Button>
        
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAsDraft} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Sauvegarder
            </Button>
            <Button onClick={handleSendForValidation} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Envoyer pour validation
            </Button>
          </div>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="objet">Objet</TabsTrigger>
          <TabsTrigger value="baremes">Barèmes</TabsTrigger>
          <TabsTrigger value="avis">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="client">
          {renderClientTab()}
        </TabsContent>

        <TabsContent value="objet">
          {renderObjetTab()}
        </TabsContent>

        <TabsContent value="baremes">
          {renderBaremesTab()}
        </TabsContent>

        <TabsContent value="avis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Avis et Décisions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="avis">Donner un avis</Label>
                <Textarea 
                  placeholder="Saisir votre avis sur cette proposition..."
                  disabled={!isEditing}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="decision">Décision</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une décision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approuve">Approuvé</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                      <SelectItem value="conditions">Approuvé sous conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="montantApprouve">Montant approuvé (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="Montant final"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing && (
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Valider la décision
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropositionDetails;
