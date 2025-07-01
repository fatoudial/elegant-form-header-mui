
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
    fournisseurs: [] as string[],
    prestatairesMaintenace: [] as string[],
    categoriesMateriels: [] as string[],
    baremeId: "",
    taux: "",
    marge: "",
    valeurResiduelle: "",
    dateDebut: "",
    dateFin: "",
    reconductionTacite: false,
    actif: true
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      fournisseurs: [],
      prestatairesMaintenace: [],
      categoriesMateriels: [],
      baremeId: "",
      taux: "",
      marge: "",
      valeurResiduelle: "",
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
      fournisseurs: convention.fournisseurs,
      prestatairesMaintenace: convention.prestatairesMaintenace,
      categoriesMateriels: convention.categoriesMateriels,
      baremeId: "",
      taux: convention.bareme.taux.toString(),
      marge: convention.bareme.marge.toString(),
      valeurResiduelle: convention.bareme.valeurResiduelle.toString(),
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
      fournisseurs: formData.fournisseurs,
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
      [array === formData.fournisseurs ? 'fournisseurs' : 
       array === formData.prestatairesMaintenace ? 'prestatairesMaintenace' : 'categoriesMateriels']: 
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
                        <Label>Fournisseurs agréés *</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {FOURNISSEURS_DISPONIBLES.map(fournisseur => (
                            <div
                              key={fournisseur}
                              className={`p-2 border rounded cursor-pointer transition-colors ${
                                formData.fournisseurs.includes(fournisseur)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => toggleArrayValue(formData.fournisseurs, fournisseur, setFormData)}
                            >
                              <div className="text-sm font-medium">
                                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Prestataires de maintenance</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {PRESTATAIRES_MAINTENANCE.map(prestataire => (
                            <div
                              key={prestataire}
                              className={`p-2 border rounded cursor-pointer transition-colors ${
                                formData.prestatairesMaintenace.includes(prestataire)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => toggleArrayValue(formData.prestatairesMaintenace, prestataire, setFormData)}
                            >
                              <div className="text-sm font-medium">
                                {prestataire.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Catégories de matériel *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {CATEGORIES_MATERIELS.map(categorie => (
                            <div
                              key={categorie.id}
                              className={`p-3 border rounded cursor-pointer transition-colors ${
                                formData.categoriesMateriels.includes(categorie.id)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => toggleArrayValue(formData.categoriesMateriels, categorie.id, setFormData)}
                            >
                              <div className="text-sm font-medium">{categorie.nom}</div>
                              <div className="text-xs text-muted-foreground">{categorie.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="baremes" className="space-y-4">
                      <div>
                        <Label>Sélectionner un barème existant</Label>
                        <Select value={formData.baremeId} onValueChange={(value) => {
                          const bareme = BAREMES_DISPONIBLES.find(b => b.id === value);
                          if (bareme) {
                            setFormData(prev => ({
                              ...prev,
                              baremeId: value,
                              taux: bareme.taux.toString(),
                              marge: bareme.marge.toString(),
                              valeurResiduelle: bareme.valeurResiduelle.toString()
                            }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un barème" />
                          </SelectTrigger>
                          <SelectContent>
                            {BAREMES_DISPONIBLES.map(bareme => (
                              <SelectItem key={bareme.id} value={bareme.id}>
                                {bareme.nom} ({bareme.taux}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <div>
                          <Label htmlFor="valeurResiduelle">Valeur Résiduelle (%)</Label>
                          <Input
                            id="valeurResiduelle"
                            type="number"
                            step="0.1"
                            value={formData.valeurResiduelle}
                            onChange={(e) => setFormData(prev => ({ ...prev, valeurResiduelle: e.target.value }))}
                            placeholder="1.8"
                          />
                        </div>
                      </div>
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
                            <Label className="text-sm font-medium text-muted-foreground">Fournisseurs</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.fournisseurs.length > 0 ? formData.fournisseurs.map(f => (
                                <Badge key={f} variant="outline">{f}</Badge>
                              )) : <span className="text-muted-foreground text-sm">Aucun sélectionné</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Barème</Label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="text-center p-3 bg-blue-50 rounded">
                                <div className="text-lg font-bold text-blue-600">{formData.taux || "0"}%</div>
                                <div className="text-xs text-muted-foreground">Taux</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded">
                                <div className="text-lg font-bold text-green-600">{formData.marge || "0"}%</div>
                                <div className="text-xs text-muted-foreground">Marge</div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded">
                                <div className="text-lg font-bold text-orange-600">{formData.valeurResiduelle || "0"}%</div>
                                <div className="text-xs text-muted-foreground">VR</div>
                              </div>
                            </div>
                          </div>
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
