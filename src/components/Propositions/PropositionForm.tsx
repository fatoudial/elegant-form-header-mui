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
import { DatePicker } from "@/components/ui/datepicker";
import { Save, Send, Calculator, Users, Building, CheckCircle, Plus, Trash2, Loader2, Minus } from "lucide-react";
import { usePropositionActions } from "@/hooks/usePropositionActions";
import QuickSimulator from "./QuickSimulator";
import AmortizationTable from "./AmortizationTable";
import { TypeProposition, Convention, Campagne } from "@/types/leasing";
import LeasingTypeSelector from "./LeasingTypeSelector";
import ConventionSelector from "./ConventionSelector";
import CampagneSelector from "./CampagneSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MaterialItem {
  id: number;
  type: "materiel" | "composant";
  parentId?: number;
  fournisseur: string;
  reference: string;
  designation: string;
  categorie: string;
  montantHT: string;
  taxe: string;
  montantTTC: string;
  quantite: string;
  prixTotal: string;
  numImmatriculation: string;
  dateImmatriculation?: Date;
  dateMiseEnService?: Date;
}

// Données de démonstration pour les conventions
const CONVENTIONS_DISPONIBLES: Convention[] = [
  {
    id: "conv-vehicules-pro",
    nom: "Véhicules Professionnels",
    description: "Convention dédiée aux véhicules utilitaires et professionnels",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 6.5,
      marge: 2.8,
      valeurResiduelle: 1.8
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true
  },
  {
    id: "conv-equipement-industriel",
    nom: "Équipement Industriel",
    description: "Convention pour les machines et équipements industriels",
    fournisseurs: ["sonacos", "afrique-materiel"],
    bareme: {
      taux: 6.0,
      marge: 2.5,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-01-01"),
    actif: true
  },
  {
    id: "conv-btp",
    nom: "BTP & Construction",
    description: "Convention spécialisée dans les équipements de construction",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 6.8,
      marge: 3.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true
  }
];

// Données de démonstration pour les campagnes
const CAMPAGNES_DISPONIBLES: Campagne[] = [
  {
    id: "camp-ete-2024",
    nom: "Campagne Été 2024",
    description: "Offre spéciale véhicules avec taux exceptionnel",
    type: "fournisseur",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 4.5,
      marge: 2.0,
      valeurResiduelle: 1.0
    },
    dateDebut: new Date("2024-06-01"),
    dateFin: new Date("2024-08-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-equipement-industriel",
    nom: "Industrialisation 2024",
    description: "Campagne banque pour l'équipement industriel",
    type: "banque",
    bareme: {
      taux: 5.0,
      marge: 2.2,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-btp-urgent",
    nom: "BTP Express",
    description: "Financement accéléré pour équipements BTP",
    type: "fournisseur",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 5.5,
      marge: 2.8,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-07-01"),
    dateFin: new Date("2024-09-30"),
    actif: true,
    prioritaire: true
  }
];

// Liste prédéfinie des matériels disponibles
const MATERIELS_DISPONIBLES = {
  "babacar-fils": [
    { ref: "VEH001", designation: "Véhicule utilitaire Renault Master", categorie: "Véhicule", montantHT: "15000000" },
    { ref: "VEH002", designation: "Camion Isuzu NPR", categorie: "Véhicule", montantHT: "25000000" },
    { ref: "EQUIP001", designation: "Groupe électrogène 100KVA", categorie: "Équipement", montantHT: "8000000" }
  ],
  "sonacos": [
    { ref: "MACH001", designation: "Machine de transformation", categorie: "Machine", montantHT: "45000000" },
    { ref: "MACH002", designation: "Équipement de conditionnement", categorie: "Machine", montantHT: "30000000" }
  ],
  "senegal-auto": [
    { ref: "AUTO001", designation: "Berline Toyota Corolla", categorie: "Véhicule", montantHT: "12000000" },
    { ref: "AUTO002", designation: "Pick-up Toyota Hilux", categorie: "Véhicule", montantHT: "18000000" }
  ],
  "dakar-equipement": [
    { ref: "BTP001", designation: "Pelleteuse CAT 320", categorie: "BTP", montantHT: "75000000" },
    { ref: "BTP002", designation: "Compacteur Dynapac", categorie: "BTP", montantHT: "35000000" }
  ],
  "afrique-materiel": [
    { ref: "IND001", designation: "Four industriel", categorie: "Industriel", montantHT: "50000000" },
    { ref: "IND002", designation: "Convoyeur automatique", categorie: "Industriel", montantHT: "20000000" }
  ]
};

const PropositionForm = () => {
  const [currentTab, setCurrentTab] = useState("type-client");
  const [clientType, setClientType] = useState<"Client" | "Prospect" | null>(null);
  
  // États pour le type de proposition global
  const [typeProposition, setTypeProposition] = useState<TypeProposition | null>(null);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
  
  const { saveAsDraft, sendForValidation, isLoading } = usePropositionActions();
  
  // État pour les matériels et composants
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  
  const [formData, setFormData] = useState({
    typeLocataire: "",
    numClient: "",
    nomClient: "",
    prenomsClient: "",
    telClient: "",
    dateNaissanceClient: undefined as Date | undefined,
    numPieceClient: "",
    categorieJuridiqueClient: "",
    secteurActivite: "",
    identifiantNational: "",
    adresseClient: "",
    
    produit: "",
    codeProduit: "",
    dateDemande: new Date(),
    dateMiseEnService: undefined as Date | undefined,
    agence: "",
    
    referenceMateriel: "",
    designation: "",
    montantHT: "",
    taxe: "",
    montantTTC: "",
    categorieMateriel: "",
    fournisseur: "",
    adresseLivraison: "",

    typeBareme: "standard",
    periodiciteLoyer: "",
    terme: "",
    nombrePeriodes: "",
    methodeCalculLoyers: "",
    tauxStandards: "",
    premierLoyerHT: "",
    margeNominale: "",
    tauxClient: "",
    valeurResiduelle: "",
    montantVR: "",

    fraisAssurance: "",
    fraisDossier: "",
    fraisTimbre: ""
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (productValue: string) => {
    updateFormData("produit", productValue);
    
    const productCodes: { [key: string]: string } = {
      "credit-bail": "CB001",
      "cession-bail": "CS001", 
      "lease-back": "LB001",
      "loa": "LOA001",
      "lld": "LLD001"
    };
    
    updateFormData("codeProduit", productCodes[productValue] || "");
  };

  // Fonction pour obtenir les fournisseurs disponibles selon le type de proposition
  const getAvailableFournisseurs = () => {
    if (typeProposition === "convention" && selectedConvention) {
      return selectedConvention.fournisseurs;
    }
    if (typeProposition === "campagne" && selectedCampagne) {
      return selectedCampagne.fournisseurs || Object.keys(MATERIELS_DISPONIBLES);
    }
    return Object.keys(MATERIELS_DISPONIBLES); // Standard - tous les fournisseurs
  };

  // Fonction pour obtenir le barème applicable
  const getApplicableBareme = () => {
    if (typeProposition === "campagne" && selectedCampagne) {
      return selectedCampagne.bareme;
    }
    if (typeProposition === "convention" && selectedConvention) {
      return selectedConvention.bareme;
    }
    return { taux: 7.5, marge: 3.0, valeurResiduelle: 2.0 }; // Standard
  };

  const addMaterialItem = (parentId?: number, type: "materiel" | "composant" = "materiel") => {
    const newId = Math.max(0, ...materialItems.map(m => m.id)) + 1;
    
    const newItem: MaterialItem = {
      id: newId,
      type: type,
      parentId: parentId,
      fournisseur: "",
      reference: "",
      designation: "",
      categorie: "",
      montantHT: "",
      taxe: "18",
      montantTTC: "",
      quantite: "1",
      prixTotal: "",
      numImmatriculation: "",
      dateImmatriculation: undefined,
      dateMiseEnService: undefined
    };
    
    setMaterialItems([...materialItems, newItem]);
  };

  const removeMaterialItem = (id: number) => {
    const itemsToRemove = [id];
    const findChildren = (parentId: number) => {
      materialItems.forEach(item => {
        if (item.parentId === parentId) {
          itemsToRemove.push(item.id);
          findChildren(item.id);
        }
      });
    };
    findChildren(id);
    
    setMaterialItems(materialItems.filter(item => !itemsToRemove.includes(item.id)));
  };

  const updateMaterialItem = (id: number, field: keyof MaterialItem, value: any) => {
    setMaterialItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'designation' && item.fournisseur && item.categorie && item.type === 'materiel') {
          const fournisseurData = MATERIELS_DISPONIBLES[item.fournisseur as keyof typeof MATERIELS_DISPONIBLES];
          const materielData = fournisseurData?.find(m => m.designation === value && m.categorie === item.categorie);
          if (materielData) {
            updatedItem.reference = materielData.ref;
            updatedItem.montantHT = materielData.montantHT;
          }
        }
        
        if (field === 'categorie') {
          updatedItem.designation = '';
          updatedItem.reference = '';
          updatedItem.montantHT = '';
        }
        
        if (field === 'fournisseur') {
          updatedItem.categorie = '';
          updatedItem.designation = '';
          updatedItem.reference = '';
          updatedItem.montantHT = '';
        }
        
        if (field === 'montantHT' || field === 'taxe' || field === 'quantite') {
          const ht = parseFloat(updatedItem.montantHT || "0");
          const tax = parseFloat(updatedItem.taxe || "0");
          const qty = parseFloat(updatedItem.quantite || "1");
          
          const ttc = ht + (ht * tax / 100);
          updatedItem.montantTTC = ttc.toFixed(2);
          updatedItem.prixTotal = (ttc * qty).toFixed(2);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const canAddComponent = (item: MaterialItem) => {
    return item.type === "materiel";
  };

  const getAvailableMateriels = (fournisseur: string) => {
    return MATERIELS_DISPONIBLES[fournisseur as keyof typeof MATERIELS_DISPONIBLES] || [];
  };

  const getAvailableCategories = (fournisseur: string) => {
    const materiels = MATERIELS_DISPONIBLES[fournisseur as keyof typeof MATERIELS_DISPONIBLES] || [];
    return [...new Set(materiels.map(m => m.categorie))];
  };

  const getAvailableDesignations = (fournisseur: string, categorie: string) => {
    const materiels = MATERIELS_DISPONIBLES[fournisseur as keyof typeof MATERIELS_DISPONIBLES] || [];
    return materiels.filter(m => m.categorie === categorie);
  };

  const isValidCampagne = (campagne: Campagne) => {
    const now = new Date();
    return campagne.actif && 
           campagne.dateDebut <= now && 
           campagne.dateFin >= now;
  };

  const handleSaveAsDraft = async () => {
    try {
      const propositionData = {
        ...formData,
        materialItems,
        clientType,
        typeProposition,
        selectedConvention,
        selectedCampagne
      };
      await saveAsDraft(propositionData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleSendForValidation = async () => {
    try {
      const propositionData = {
        ...formData,
        materialItems,
        clientType,
        typeProposition,
        selectedConvention,
        selectedCampagne
      };
      await sendForValidation(propositionData);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const renderClientTypeSelection = () => (
    <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Type de demandeur</h2>
        <p className="text-muted-foreground text-sm md:text-base">Sélectionnez le type de client pour cette proposition</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            clientType === "Client" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => {
            setClientType("Client");
            updateFormData("typeLocataire", "Client");
          }}
        >
          <CardContent className="pt-6 text-center p-4 md:p-6">
            <div className="mb-4">
              <CheckCircle className="h-8 w-8 md:h-12 md:w-12 mx-auto text-green-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Client Existant</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Client déjà enregistré dans votre base de données
            </p>
            <Badge variant="secondary">Recommandé</Badge>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            clientType === "Prospect" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => {
            setClientType("Prospect");
            updateFormData("typeLocataire", "Prospect");
          }}
        >
          <CardContent className="pt-6 text-center p-4 md:p-6">
            <div className="mb-4">
              <Users className="h-8 w-8 md:h-12 md:w-12 mx-auto text-blue-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Nouveau Prospect</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Nouveau client à enregistrer dans le système
            </p>
            <Badge variant="outline">Nouveau</Badge>
          </CardContent>
        </Card>
      </div>

      {clientType && (
        <Button 
          onClick={() => setCurrentTab("type-proposition")}
          className="mt-6 w-full md:w-auto"
        >
          Continuer avec {clientType}
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 min-w-[600px] md:min-w-full">
            <TabsTrigger value="type-client" className="text-xs">Type Client</TabsTrigger>
            <TabsTrigger value="type-proposition" disabled={!clientType} className="text-xs">Type Proposition</TabsTrigger>
            <TabsTrigger value="client" disabled={!typeProposition} className="text-xs">1. Client</TabsTrigger>
            <TabsTrigger value="general" className="text-xs">2. Général</TabsTrigger>
            <TabsTrigger value="materiel" className="text-xs">3. Matériel</TabsTrigger>
            <TabsTrigger value="baremes" className="text-xs">4. Barèmes</TabsTrigger>
            <TabsTrigger value="prestations" className="text-xs">5. Prestations</TabsTrigger>
            <TabsTrigger value="amortissement" className="text-xs">6. Amortissement</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="type-client">
          {renderClientTypeSelection()}
        </TabsContent>

        <TabsContent value="type-proposition">
          <div className="space-y-6">
            <LeasingTypeSelector
              selectedType={typeProposition}
              onTypeSelect={setTypeProposition}
              onContinue={() => {
                if (typeProposition === "convention") {
                  // Afficher sélecteur de convention
                } else if (typeProposition === "campagne") {
                  // Afficher sélecteur de campagne
                } else {
                  setCurrentTab("client");
                }
              }}
            />
            
            {typeProposition === "convention" && (
              <div className="space-y-4">
                <ConventionSelector
                  selectedConvention={selectedConvention}
                  onConventionSelect={setSelectedConvention}
                />
                {selectedConvention && (
                  <Button onClick={() => setCurrentTab("client")} className="w-full">
                    Continuer avec la convention "{selectedConvention.nom}"
                  </Button>
                )}
              </div>
            )}
            
            {typeProposition === "campagne" && (
              <div className="space-y-4">
                <CampagneSelector
                  selectedCampagne={selectedCampagne}
                  onCampagneSelect={setSelectedCampagne}
                />
                {selectedCampagne && (
                  <Button onClick={() => setCurrentTab("client")} className="w-full">
                    Continuer avec la campagne "{selectedCampagne.nom}"
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="client" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                {clientType === "Client" ? <Building className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                Informations {clientType}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeLocataire">Type locataire *</Label>
                  <Select value={formData.typeLocataire} onValueChange={(value) => updateFormData("typeLocataire", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numClient">Numéro Client</Label>
                  <Input 
                    placeholder="Numéro client"
                    value={formData.numClient}
                    onChange={(e) => updateFormData("numClient", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomClient">Nom Client *</Label>
                  <Input 
                    placeholder="Ex: Diallo, Ndiaye, Fall" 
                    value={formData.nomClient}
                    onChange={(e) => updateFormData("nomClient", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="prenomsClient">Prénoms Client</Label>
                  <Input 
                    placeholder="Ex: Ousmane, Aissatou, Mamadou" 
                    value={formData.prenomsClient}
                    onChange={(e) => updateFormData("prenomsClient", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="telClient">Téléphone Client *</Label>
                  <Input 
                    type="tel"
                    placeholder="77 123 45 67" 
                    value={formData.telClient}
                    onChange={(e) => updateFormData("telClient", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateNaissanceClient">Date de naissance</Label>
                  <DatePicker
                    value={formData.dateNaissanceClient}
                    onChange={(date) => updateFormData("dateNaissanceClient", date)}
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                <div>
                  <Label htmlFor="numPieceClient">Numéro pièce Client</Label>
                  <Input 
                    placeholder="Numéro pièce d'identité"
                    value={formData.numPieceClient}
                    onChange={(e) => updateFormData("numPieceClient", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="categorieJuridiqueClient">Catégorie Juridique</Label>
                  <Input 
                    placeholder="Ex: SARL, SAS, SA..."
                    value={formData.categorieJuridiqueClient}
                    onChange={(e) => updateFormData("categorieJuridiqueClient", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secteurActivite">Secteur d'activité *</Label>
                  <Input 
                    placeholder="Ex: Commerce, Agriculture, Transport"
                    value={formData.secteurActivite}
                    onChange={(e) => updateFormData("secteurActivite", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="identifiantNational">Identifiant National</Label>
                  <Input 
                    placeholder="NINEA"
                    value={formData.identifiantNational}
                    onChange={(e) => updateFormData("identifiantNational", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adresseClient">Adresse Client *</Label>
                <Textarea 
                  placeholder="Ex: Médina, Rue 12 x 13, Dakar" 
                  value={formData.adresseClient}
                  onChange={(e) => updateFormData("adresseClient", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Données générales de la proposition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="produit">Produit *</Label>
                  <Select 
                    value={formData.produit} 
                    onValueChange={handleProductChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le produit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-bail">Crédit-bail</SelectItem>
                      <SelectItem value="cession-bail">Cession bail</SelectItem>
                      <SelectItem value="lease-back">Lease-back</SelectItem>
                      <SelectItem value="loa">LOA</SelectItem>
                      <SelectItem value="lld">LLD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="codeProduit">Code produit</Label>
                  <Input 
                    placeholder="Code auto-généré"
                    value={formData.codeProduit}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateDemande">Date de la demande *</Label>
                  <DatePicker
                    value={formData.dateDemande}
                    onChange={(date) => updateFormData("dateDemande", date)}
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                <div>
                  <Label htmlFor="dateMiseEnService">Date de mise en service prévisionnelle</Label>
                  <DatePicker
                    value={formData.dateMiseEnService}
                    onChange={(date) => updateFormData("dateMiseEnService", date)}
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                <div>
                  <Label htmlFor="agence">Agence *</Label>
                  <Input 
                    placeholder="Ex: Dakar Plateau, Thiès, Saint-Louis"
                    value={formData.agence}
                    onChange={(e) => updateFormData("agence", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materiel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Matériel et Composants à financer</CardTitle>
              {(typeProposition === "convention" && selectedConvention) && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    📋 <strong>Convention "{selectedConvention.nom}" :</strong> Seuls les fournisseurs partenaires sont disponibles
                  </p>
                </div>
              )}
              {(typeProposition === "campagne" && selectedCampagne) && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700">
                    🎯 <strong>Campagne "{selectedCampagne.nom}" :</strong> Taux exceptionnel de {selectedCampagne.bareme.taux}% (prioritaire)
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button onClick={() => addMaterialItem(undefined, "materiel")} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un matériel
                </Button>
                <Button onClick={() => addMaterialItem(undefined, "composant")} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un composant
                </Button>
              </div>

              {materialItems.length > 0 && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Fournisseur</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead>Désignation</TableHead>
                          <TableHead>Montant HT</TableHead>
                          <TableHead>Qté</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materialItems.map((item) => (
                          <TableRow key={item.id} className={item.type === "composant" ? "bg-blue-50" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.parentId && <span className="text-gray-400">└─</span>}
                                <Badge variant={item.type === "materiel" ? "default" : "secondary"}>
                                  {item.type === "materiel" ? "Matériel" : "Composant"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={item.fournisseur}
                                onValueChange={(value) => updateMaterialItem(item.id, "fournisseur", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Fournisseur" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableFournisseurs().map(f => (
                                    <SelectItem key={f} value={f}>
                                      {f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={item.reference}
                                onChange={(e) => updateMaterialItem(item.id, "reference", e.target.value)}
                                placeholder="Référence"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={item.designation}
                                onChange={(e) => updateMaterialItem(item.id, "designation", e.target.value)}
                                placeholder="Désignation"
                                className="w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                value={item.montantHT}
                                onChange={(e) => updateMaterialItem(item.id, "montantHT", e.target.value)}
                                placeholder="0"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newQty = Math.max(1, parseInt(item.quantite) - 1);
                                    updateMaterialItem(item.id, "quantite", newQty.toString());
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input 
                                  type="number"
                                  value={item.quantite}
                                  onChange={(e) => updateMaterialItem(item.id, "quantite", e.target.value)}
                                  className="w-12 text-center"
                                  min="1"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newQty = parseInt(item.quantite) + 1;
                                    updateMaterialItem(item.id, "quantite", newQty.toString());
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {canAddComponent(item) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addMaterialItem(item.id, "composant")}
                                    title="Ajouter un composant"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeMaterialItem(item.id)}
                                  title="Supprimer"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Affichage du barème appliqué */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-3">Barème appliqué</h3>
                    <div className="flex gap-4 text-sm text-green-700">
                      <span>Type: <strong>{typeProposition || "Standard"}</strong></span>
                      <span>Taux: <strong>{getApplicableBareme().taux}%</strong></span>
                      <span>Marge: <strong>{getApplicableBareme().marge}%</strong></span>
                      <span>VR: <strong>{getApplicableBareme().valeurResiduelle}%</strong></span>
                    </div>
                    {typeProposition === "campagne" && (
                      <p className="text-xs text-red-600 mt-2">⚡ Campagne prioritaire - Taux exceptionnel appliqué</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="baremes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Calculator className="h-5 w-5" />
                Barèmes de financement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="periodiciteLoyer">Périodicité loyer *</Label>
                  <Select value={formData.periodiciteLoyer} onValueChange={(value) => updateFormData("periodiciteLoyer", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Mensuelle</SelectItem>
                      <SelectItem value="T">Trimestrielle</SelectItem>
                      <SelectItem value="S">Semestrielle</SelectItem>
                      <SelectItem value="A">Annuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="terme">Terme</Label>
                  <Select value={formData.terme} onValueChange={(value) => updateFormData("terme", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="echeoir">A échoir</SelectItem>
                      <SelectItem value="echue">Échue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nombrePeriodes">Nombre de périodes</Label>
                  <Input 
                    type="number" 
                    placeholder="36" 
                    value={formData.nombrePeriodes}
                    onChange={(e) => updateFormData("nombrePeriodes", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="methodeCalculLoyers">Méthode de calcul des loyers</Label>
                  <Select value={formData.methodeCalculLoyers} onValueChange={(value) => updateFormData("methodeCalculLoyers", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lineaire">Linéaire</SelectItem>
                      <SelectItem value="degressive">Dégressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premierLoyerHT">Premier loyer HT (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.premierLoyerHT}
                    onChange={(e) => updateFormData("premierLoyerHT", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="montantVR">Montant VR (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.montantVR}
                    onChange={(e) => updateFormData("montantVR", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <QuickSimulator />
        </TabsContent>

        <TabsContent value="prestations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Prestations et frais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fraisAssurance">Frais d'assurance (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.fraisAssurance}
                    onChange={(e) => updateFormData("fraisAssurance", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fraisDossier">Frais de dossier (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.fraisDossier}
                    onChange={(e) => updateFormData("fraisDossier", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fraisTimbre">Frais de timbre (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.fraisTimbre}
                    onChange={(e) => updateFormData("fraisTimbre", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Récapitulatif des frais</h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Total frais :</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(parseFloat(formData.fraisAssurance || "0") + 
                        parseFloat(formData.fraisDossier || "0") + 
                        parseFloat(formData.fraisTimbre || "0"))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amortissement" className="space-y-6">
          <AmortizationTable 
            montant={parseFloat(formData.montantTTC) || 50000000}
            duree={parseInt(formData.nombrePeriodes) || 36}
            taux={getApplicableBareme().taux}
          />
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSaveAsDraft}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Sauvegarder en brouillon
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSendForValidation}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Envoyer pour validation
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropositionForm;
