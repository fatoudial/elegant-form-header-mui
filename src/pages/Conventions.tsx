
import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Handshake, FileText, Calendar, RefreshCw, XCircle } from "lucide-react";
import { Convention, BaremeComplet, CategorieMatriel } from "@/types/leasing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Données de démonstration étendues
const CONVENTIONS_DEMO: Convention[] = [
  {
    id: "conv-vehicules-pro",
    nom: "Véhicules Professionnels 2024",
    description: "Convention dédiée aux véhicules utilitaires et professionnels avec conditions préférentielles",
    fournisseurs: ["babacar-fils"],
    prestatairesMaintenace: ["garage-centrale", "maintenance-rapide"],
    categoriesMateriels: ["vehicules-utilitaires", "camions"],
    bareme: {
      taux: 6.5,
      marge: 2.8,
      valeurResiduelle: 1.8
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: true,
    actif: true,
    statut: "active"
  },
  {
    id: "conv-equipement-industriel",
    nom: "Équipement Industriel Premium",
    description: "Convention pour les machines et équipements industriels haute gamme",
    fournisseurs: ["sonacos", "afrique-materiel"],
    prestatairesMaintenace: ["techno-maintenance"],
    categoriesMateriels: ["machines-industrielles", "equipement-production"],
    bareme: {
      taux: 6.0,
      marge: 2.5,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-01-01"),
    reconductionTacite: false,
    actif: true,
    statut: "active"
  },
  {
    id: "conv-btp-expire",
    nom: "BTP & Construction - Expirée",
    description: "Convention expirée pour les équipements de construction",
    fournisseurs: ["dakar-equipement"],
    prestatairesMaintenace: ["btp-services"],
    categoriesMateriels: ["engins-btp"],
    bareme: {
      taux: 6.8,
      marge: 3.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2023-01-01"),
    dateFin: new Date("2023-12-31"),
    reconductionTacite: false,
    actif: false,
    statut: "expiree"
  }
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement", "techno-equipement"
];

const PRESTATAIRES_MAINTENANCE = [
  "garage-centrale", "maintenance-rapide", "techno-maintenance", "btp-services", "auto-services"
];

const CATEGORIES_MATERIELS: CategorieMatriel[] = [
  { id: "vehicules-utilitaires", nom: "Véhicules Utilitaires", description: "Camionnettes, fourgons, utilitaires légers" },
  { id: "camions", nom: "Camions", description: "Poids lourds, semi-remorques" },
  { id: "machines-industrielles", nom: "Machines Industrielles", description: "Équipements de production industrielle" },
  { id: "equipement-production", nom: "Équipement de Production", description: "Chaînes de production, robots" },
  { id: "engins-btp", nom: "Engins BTP", description: "Bulldozers, excavateurs, grues" }
];

const BAREMES_DISPONIBLES: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    dateCreation: new Date(),
    actif: true
  },
  {
    id: "bar-pref-001",
    nom: "Barème Préférentiel",
    type: "derogatoire",
    taux: 6.2,
    marge: 2.5,
    valeurResiduelle: 2.0,
    dateCreation: new Date(),
    actif: true
  }
];

const Conventions = () => {
  const [conventions, setConventions] = useState<Convention[]>(CONVENTIONS_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConvention, setEditingConvention] = useState<Convention | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    fournisseur: "", // Single fournisseur instead of array
    prestatairesMaintenace: [] as string[],
    categoriesMateriels: [] as string[],
    typologie: "",
    type: "",
    taux: "",
    duree: "",
    periodicite: "",
    typeEcheancier: "",
    marge: "",
    valeurResiduelle: "",
    valeurReprise: "",
    premierLoyerMajore: "",
    premierLoyerType: "sup",
    conditions: [] as any[],
    dateDebut: "",
    dateFin: "",
    reconductionTacite: false,
    actif: true
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      fournisseur: "",
      prestatairesMaintenace: [],
      categoriesMateriels: [],
      typologie: "",
      type: "",
      taux: "",
      duree: "",
      periodicite: "",
      typeEcheancier: "",
      marge: "",
      valeurResiduelle: "",
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      conditions: [],
      dateDebut: "",
      dateFin: "",
      reconductionTacite: false,
      actif: true
    });
    setEditingConvention(null);
  };

  const handleEdit = (convention: Convention) => {
    setEditingConvention(convention);
    setFormData({
      nom: convention.nom,
      description: convention.description,
      fournisseur: convention.fournisseurs[0] || "",
      prestatairesMaintenace: convention.prestatairesMaintenace,
      categoriesMateriels: convention.categoriesMateriels,
      typologie: "",
      type: "",
      taux: convention.bareme.taux.toString(),
      duree: "",
      periodicite: "",
      typeEcheancier: "",
      marge: convention.bareme.marge.toString(),
      valeurResiduelle: convention.bareme.valeurResiduelle.toString(),
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      conditions: [],
      dateDebut: convention.dateDebut.toISOString().split('T')[0],
      dateFin: convention.dateFin ? convention.dateFin.toISOString().split('T')[0] : "",
      reconductionTacite: convention.reconductionTacite,
      actif: convention.actif
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const conventionData: Convention = {
      id: editingConvention?.id || `conv-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      fournisseurs: [formData.fournisseur],
      prestatairesMaintenace: formData.prestatairesMaintenace,
      categoriesMateriels: formData.categoriesMateriels,
      bareme: {
        taux: parseFloat(formData.taux),
        marge: parseFloat(formData.marge),
        valeurResiduelle: parseFloat(formData.valeurResiduelle)
      },
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      reconductionTacite: formData.reconductionTacite,
      actif: formData.actif,
      statut: formData.actif ? "active" : "suspendue"
    };

    if (editingConvention) {
      setConventions(prev => prev.map(c => c.id === editingConvention.id ? conventionData : c));
    } else {
      setConventions(prev => [...prev, conventionData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleResilier = (id: string) => {
    setConventions(prev => prev.map(c => 
      c.id === id ? { ...c, statut: "resiliee" as const, actif: false } : c
    ));
  };

  const handleReconduire = (convention: Convention) => {
    const nouvelleConvention: Convention = {
      ...convention,
      id: `conv-${Date.now()}`,
      nom: `${convention.nom} - Reconduite`,
      dateDebut: new Date(),
      dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      statut: "active",
      actif: true
    };
    setConventions(prev => [...prev, nouvelleConvention]);
  };

  const generatePDF = (convention: Convention) => {
    // Simulation de génération PDF
    console.log(`Génération PDF pour la convention: ${convention.nom}`);
    alert(`PDF généré pour la convention "${convention.nom}"`);
  };

  const getFilteredConventions = () => {
    switch (currentTab) {
      case "actives":
        return conventions.filter(c => c.statut === "active");
      case "expirees":
        return conventions.filter(c => c.statut === "expiree");
      case "resiliees":
        return conventions.filter(c => c.statut === "resiliee");
      default:
        return conventions;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expiree":
        return "bg-yellow-100 text-yellow-800";
      case "resiliee":
        return "bg-red-100 text-red-800";
      case "suspendue":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleArrayValue = (array: string[], value: string, setter: (prev: any) => void) => {
    setter((prev: any) => ({
      ...prev,
      [array === formData.prestatairesMaintenace ? 'prestatairesMaintenace' : 'categoriesMateriels']: 
       array.includes(value) ? array.filter(item => item !== value) : [...array, value]
    }));
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
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Handshake className="h-8 w-8 text-purple-500" />
                  Gestion des Conventions
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gérez les conventions de leasing avec les fournisseurs partenaires
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Convention
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingConvention ? "Modifier la Convention" : "Nouvelle Convention"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la convention de leasing
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
                      <TabsTrigger value="baremes">Barèmes</TabsTrigger>
                      <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nom">Nom de la convention *</Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                            placeholder="Ex: Véhicules Professionnels 2024"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="reconduction"
                            checked={formData.reconductionTacite}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reconductionTacite: checked }))}
                          />
                          <Label htmlFor="reconduction">Reconduction tacite</Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description détaillée de la convention..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateDebut">Date de début *</Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateFin">Date de fin</Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="partenaires" className="space-y-4">
                      <div>
                        <Label>Fournisseur agréé *</Label>
                        <Select value={formData.fournisseur} onValueChange={(value) => setFormData(prev => ({ ...prev, fournisseur: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            {FOURNISSEURS_DISPONIBLES.map(fournisseur => (
                              <SelectItem key={fournisseur} value={fournisseur}>
                                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Prestataires de maintenance</Label>
                        <Select onValueChange={(value) => {
                          if (!formData.prestatairesMaintenace.includes(value)) {
                            setFormData(prev => ({ ...prev, prestatairesMaintenace: [...prev.prestatairesMaintenace, value] }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter un prestataire" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRESTATAIRES_MAINTENANCE.filter(p => !formData.prestatairesMaintenace.includes(p)).map(prestataire => (
                              <SelectItem key={prestataire} value={prestataire}>
                                {prestataire.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.prestatairesMaintenace.map(prestataire => (
                            <Badge key={prestataire} variant="secondary" className="gap-1">
                              {prestataire.replace('-', ' ')}
                              <button
                                onClick={() => setFormData(prev => ({ 
                                  ...prev, 
                                  prestatairesMaintenace: prev.prestatairesMaintenace.filter(p => p !== prestataire) 
                                }))}
                                className="text-xs"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Catégories de matériel *</Label>
                        <Select onValueChange={(value) => {
                          if (!formData.categoriesMateriels.includes(value)) {
                            setFormData(prev => ({ ...prev, categoriesMateriels: [...prev.categoriesMateriels, value] }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES_MATERIELS.filter(c => !formData.categoriesMateriels.includes(c.id)).map(categorie => (
                              <SelectItem key={categorie.id} value={categorie.id}>
                                {categorie.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.categoriesMateriels.map(categorieId => {
                            const categorie = CATEGORIES_MATERIELS.find(c => c.id === categorieId);
                            return (
                              <Badge key={categorieId} variant="secondary" className="gap-1">
                                {categorie?.nom}
                                <button
                                  onClick={() => setFormData(prev => ({ 
                                    ...prev, 
                                    categoriesMateriels: prev.categoriesMateriels.filter(c => c !== categorieId) 
                                  }))}
                                  className="text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="baremes" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="typologie">Typologie *</Label>
                          <Select value={formData.typologie} onValueChange={(value) => setFormData(prev => ({ ...prev, typologie: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une typologie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Crédit-Bail">Crédit-Bail</SelectItem>
                              <SelectItem value="LOA">LOA</SelectItem>
                              <SelectItem value="LLD">LLD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type">Type *</Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="derogatoire">Dérogatoire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="taux">Taux (%)</Label>
                          <Input
                            id="taux"
                            type="number"
                            step="0.1"
                            value={formData.taux}
                            onChange={(e) => setFormData(prev => ({ ...prev, taux: e.target.value }))}
                            placeholder="6.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duree">Durée (mois)</Label>
                          <Input
                            id="duree"
                            type="number"
                            value={formData.duree}
                            onChange={(e) => setFormData(prev => ({ ...prev, duree: e.target.value }))}
                            placeholder="36"
                          />
                        </div>
                        <div>
                          <Label htmlFor="periodicite">Périodicité</Label>
                          <Select value={formData.periodicite} onValueChange={(value) => setFormData(prev => ({ ...prev, periodicite: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mensuelle">Mensuelle</SelectItem>
                              <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                              <SelectItem value="semestrielle">Semestrielle</SelectItem>
                              <SelectItem value="annuelle">Annuelle</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="typeEcheancier">Type échéancier</Label>
                          <Select value={formData.typeEcheancier} onValueChange={(value) => setFormData(prev => ({ ...prev, typeEcheancier: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="constant">Constant</SelectItem>
                              <SelectItem value="progressif">Progressif</SelectItem>
                              <SelectItem value="degressif">Dégressif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="valeurResiduelle">
                            {formData.typologie === "LLD" ? "Valeur de reprise (%)" : "Valeur résiduelle (%)"}
                          </Label>
                          <Input
                            id="valeurResiduelle"
                            type="number"
                            step="0.1"
                            value={formData.typologie === "LLD" ? formData.valeurReprise : formData.valeurResiduelle}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              [formData.typologie === "LLD" ? "valeurReprise" : "valeurResiduelle"]: e.target.value 
                            }))}
                            placeholder="1.8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="marge">Marge (%)</Label>
                          <Input
                            id="marge"
                            type="number"
                            step="0.1"
                            value={formData.marge}
                            onChange={(e) => setFormData(prev => ({ ...prev, marge: e.target.value }))}
                            placeholder="2.8"
                          />
                        </div>
                      </div>

                      {formData.type === "derogatoire" && (
                        <div>
                          <Label>1er loyer majoré</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Select value={formData.premierLoyerType} onValueChange={(value) => setFormData(prev => ({ ...prev, premierLoyerType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sup">Supérieur à</SelectItem>
                                <SelectItem value="inf">Inférieur à</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.1"
                              value={formData.premierLoyerMajore}
                              onChange={(e) => setFormData(prev => ({ ...prev, premierLoyerMajore: e.target.value }))}
                              placeholder="Valeur"
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="apercu" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Aperçu de la Convention</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                              <p className="font-medium">{formData.nom || "Non renseigné"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Période</Label>
                              <p className="font-medium">
                                {formData.dateDebut ? new Date(formData.dateDebut).toLocaleDateString() : "Non définie"} 
                                {formData.dateFin && ` - ${new Date(formData.dateFin).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Fournisseur</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.fournisseur ? (
                                <Badge variant="outline">{formData.fournisseur.replace('-', ' ')}</Badge>
                              ) : <span className="text-muted-foreground text-sm">Aucun sélectionné</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Prestataires de maintenance</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.prestatairesMaintenace.length > 0 ? formData.prestatairesMaintenace.map(p => (
                                <Badge key={p} variant="outline">{p.replace('-', ' ')}</Badge>
                              )) : <span className="text-muted-foreground text-sm">Aucun sélectionné</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Catégories de matériel</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.categoriesMateriels.length > 0 ? formData.categoriesMateriels.map(catId => {
                                const cat = CATEGORIES_MATERIELS.find(c => c.id === catId);
                                return <Badge key={catId} variant="outline">{cat?.nom}</Badge>;
                              }) : <span className="text-muted-foreground text-sm">Aucune sélectionnée</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Configuration Barème</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div className="p-3 bg-gray-50 rounded">
                                <div className="text-sm font-medium">Typologie</div>
                                <div className="text-lg font-bold">{formData.typologie || "Non définie"}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded">
                                <div className="text-sm font-medium">Type</div>
                                <div className="text-lg font-bold">{formData.type || "Non défini"}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Conditions Financières</Label>
                            <div className="grid grid-cols-4 gap-4 mt-2">
                              <div className="text-center p-3 bg-blue-50 rounded">
                                <div className="text-lg font-bold text-blue-600">{formData.taux || "0"}%</div>
                                <div className="text-xs text-muted-foreground">Taux</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded">
                                <div className="text-lg font-bold text-green-600">{formData.duree || "0"}</div>
                                <div className="text-xs text-muted-foreground">Durée (mois)</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded">
                                <div className="text-lg font-bold text-purple-600">{formData.periodicite || "Non définie"}</div>
                                <div className="text-xs text-muted-foreground">Périodicité</div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded">
                                <div className="text-lg font-bold text-orange-600">
                                  {formData.typologie === "LLD" ? (formData.valeurReprise || "0") : (formData.valeurResiduelle || "0")}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formData.typologie === "LLD" ? "Valeur reprise" : "VR"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-lg font-bold text-gray-600">{formData.typeEcheancier || "Non défini"}</div>
                              <div className="text-xs text-muted-foreground">Type échéancier</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded">
                              <div className="text-lg font-bold text-red-600">{formData.marge || "0"}%</div>
                              <div className="text-xs text-muted-foreground">Marge</div>
                            </div>
                          </div>

                          {formData.type === "derogatoire" && formData.premierLoyerMajore && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">1er Loyer Majoré</Label>
                              <div className="p-3 bg-yellow-50 rounded mt-1">
                                <div className="text-lg font-bold text-yellow-600">
                                  {formData.premierLoyerType === "sup" ? "≥ " : "≤ "}{formData.premierLoyerMajore}%
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      {editingConvention ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="actives">Conventions Actives</TabsTrigger>
                <TabsTrigger value="expirees">Expirées</TabsTrigger>
                <TabsTrigger value="resiliees">Résiliées</TabsTrigger>
              </TabsList>

              {["actives", "expirees", "resiliees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {tab === "actives" && "Conventions actives"}
                        {tab === "expirees" && "Conventions expirées"}
                        {tab === "resiliees" && "Conventions résiliées"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Convention</TableHead>
                            <TableHead>Fournisseurs</TableHead>
                            <TableHead>Barème</TableHead>
                            <TableHead>Période</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredConventions().map((convention) => (
                            <TableRow key={convention.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{convention.nom}</div>
                                  <div className="text-sm text-muted-foreground">{convention.description}</div>
                                  {convention.reconductionTacite && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Reconduction tacite
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {convention.fournisseurs.slice(0, 2).map(f => (
                                    <Badge key={f} variant="outline" className="text-xs">
                                      {f.replace('-', ' ')}
                                    </Badge>
                                  ))}
                                  {convention.fournisseurs.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{convention.fournisseurs.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Taux: {convention.bareme.taux}%</div>
                                  <div>Marge: {convention.bareme.marge}%</div>
                                  <div>VR: {convention.bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Début: {convention.dateDebut.toLocaleDateString()}</div>
                                  {convention.dateFin && (
                                    <div>Fin: {convention.dateFin.toLocaleDateString()}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatutColor(convention.statut)}>
                                  {convention.statut}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(convention)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generatePDF(convention)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  {convention.statut === "expiree" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReconduire(convention)}
                                      className="text-green-600"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {convention.statut === "active" && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Résilier la convention</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Êtes-vous sûr de vouloir résilier la convention "{convention.nom}" ? 
                                            Cette action est irréversible.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleResilier(convention.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Résilier
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Conventions;
