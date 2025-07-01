
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
import { Plus, Edit, Trash2, Zap, Calendar, Target } from "lucide-react";
import { Campagne } from "@/types/leasing";
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

// Données de démonstration pour les campagnes
const CAMPAGNES_DEMO: Campagne[] = [
  {
    id: "camp-vehicules-2024",
    nom: "Promo Véhicules Été 2024",
    description: "Campagne promotionnelle spéciale pour les véhicules utilitaires pendant l'été",
    type: "fournisseur",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 5.5,
      marge: 2.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-06-01"),
    dateFin: new Date("2024-08-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-banque-agricole",
    nom: "Financement Agricole Banque",
    description: "Campagne banque pour soutenir le secteur agricole avec des taux préférentiels",
    type: "banque",
    bareme: {
      taux: 6.0,
      marge: 2.2,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true,
    prioritaire: false
  },
  {
    id: "camp-btp-expired",
    nom: "BTP Express - Expirée",
    description: "Campagne expirée pour les équipements BTP",
    type: "fournisseur",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 5.8,
      marge: 2.3,
      valeurResiduelle: 1.8
    },
    dateDebut: new Date("2023-09-01"),
    dateFin: new Date("2023-12-31"),
    actif: false,
    prioritaire: false
  }
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement", "techno-equipement"
];

const Campagnes = () => {
  const [campagnes, setCampagnes] = useState<Campagne[]>(CAMPAGNES_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<Campagne | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "fournisseur" as "fournisseur" | "banque",
    fournisseurs: [] as string[],
    taux: "",
    marge: "",
    valeurResiduelle: "",
    dateDebut: "",
    dateFin: "",
    prioritaire: false,
    actif: true
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      type: "fournisseur",
      fournisseurs: [],
      taux: "",
      marge: "",
      valeurResiduelle: "",
      dateDebut: "",
      dateFin: "",
      prioritaire: false,
      actif: true
    });
    setEditingCampagne(null);
  };

  const handleEdit = (campagne: Campagne) => {
    setEditingCampagne(campagne);
    setFormData({
      nom: campagne.nom,
      description: campagne.description,
      type: campagne.type,
      fournisseurs: campagne.fournisseurs || [],
      taux: campagne.bareme.taux.toString(),
      marge: campagne.bareme.marge.toString(),
      valeurResiduelle: campagne.bareme.valeurResiduelle.toString(),
      dateDebut: campagne.dateDebut.toISOString().split('T')[0],
      dateFin: campagne.dateFin.toISOString().split('T')[0],
      prioritaire: campagne.prioritaire,
      actif: campagne.actif
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const campagneData: Campagne = {
      id: editingCampagne?.id || `camp-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      type: formData.type,
      fournisseurs: formData.type === "fournisseur" ? formData.fournisseurs : undefined,
      bareme: {
        taux: parseFloat(formData.taux),
        marge: parseFloat(formData.marge),
        valeurResiduelle: parseFloat(formData.valeurResiduelle)
      },
      dateDebut: new Date(formData.dateDebut),
      dateFin: new Date(formData.dateFin),
      prioritaire: formData.prioritaire,
      actif: formData.actif
    };

    if (editingCampagne) {
      setCampagnes(prev => prev.map(c => c.id === editingCampagne.id ? campagneData : c));
    } else {
      setCampagnes(prev => [...prev, campagneData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setCampagnes(prev => prev.filter(c => c.id !== id));
  };

  const getFilteredCampagnes = () => {
    const now = new Date();
    switch (currentTab) {
      case "actives":
        return campagnes.filter(c => c.actif && c.dateFin > now);
      case "expirees":
        return campagnes.filter(c => c.dateFin <= now);
      case "prioritaires":
        return campagnes.filter(c => c.prioritaire && c.actif);
      default:
        return campagnes;
    }
  };

  const getStatutColor = (campagne: Campagne) => {
    const now = new Date();
    if (!campagne.actif) return "bg-gray-100 text-gray-800";
    if (campagne.dateFin <= now) return "bg-red-100 text-red-800";
    if (campagne.prioritaire) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  const getStatutText = (campagne: Campagne) => {
    const now = new Date();
    if (!campagne.actif) return "Inactive";
    if (campagne.dateFin <= now) return "Expirée";
    if (campagne.prioritaire) return "Prioritaire";
    return "Active";
  };

  const toggleFournisseur = (fournisseur: string) => {
    setFormData(prev => ({
      ...prev,
      fournisseurs: prev.fournisseurs.includes(fournisseur)
        ? prev.fournisseurs.filter(f => f !== fournisseur)
        : [...prev.fournisseurs, fournisseur]
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
                  <Zap className="h-8 w-8 text-red-500" />
                  Gestion des Campagnes
                </h1>
                <p className="text-muted-foreground mt-2">
                  Créez et gérez les campagnes promotionnelles de financement
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCampagne ? "Modifier la Campagne" : "Nouvelle Campagne"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la campagne promotionnelle
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom de la campagne *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Promo Véhicules Été 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type de campagne *</Label>
                        <Select value={formData.type} onValueChange={(value: "fournisseur" | "banque") => setFormData(prev => ({ ...prev, type: value, fournisseurs: [] }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fournisseur">Campagne Fournisseur</SelectItem>
                            <SelectItem value="banque">Campagne Banque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description de la campagne..."
                        rows={3}
                      />
                    </div>

                    {formData.type === "fournisseur" && (
                      <div>
                        <Label>Fournisseurs partenaires *</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {FOURNISSEURS_DISPONIBLES.map(fournisseur => (
                            <div
                              key={fournisseur}
                              className={`p-2 border rounded cursor-pointer transition-colors ${
                                formData.fournisseurs.includes(fournisseur)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => toggleFournisseur(fournisseur)}
                            >
                              <div className="text-sm font-medium">
                                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taux">Taux promotionnel (%)</Label>
                        <Input
                          id="taux"
                          type="number"
                          step="0.1"
                          value={formData.taux}
                          onChange={(e) => setFormData(prev => ({ ...prev, taux: e.target.value }))}
                          placeholder="5.5"
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
                          placeholder="2.0"
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
                          placeholder="1.5"
                        />
                      </div>
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
                        <Label htmlFor="dateFin">Date de fin *</Label>
                        <Input
                          id="dateFin"
                          type="date"
                          value={formData.dateFin}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="prioritaire"
                          checked={formData.prioritaire}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prioritaire: checked }))}
                        />
                        <Label htmlFor="prioritaire">Campagne prioritaire</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="actif"
                          checked={formData.actif}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, actif: checked }))}
                        />
                        <Label htmlFor="actif">Active</Label>
                      </div>
                    </div>

                    {formData.prioritaire && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-800">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Campagne Prioritaire</span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          Cette campagne aura la priorité sur les autres barèmes lors du calcul des propositions.
                        </p>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      {editingCampagne ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="actives">Campagnes Actives</TabsTrigger>
                <TabsTrigger value="prioritaires">Prioritaires</TabsTrigger>
                <TabsTrigger value="expirees">Expirées</TabsTrigger>
              </TabsList>

              {["actives", "prioritaires", "expirees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tab === "actives" && <><Calendar className="h-5 w-5" />Campagnes actives</>}
                        {tab === "prioritaires" && <><Target className="h-5 w-5" />Campagnes prioritaires</>}
                        {tab === "expirees" && <><Calendar className="h-5 w-5" />Campagnes expirées</>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campagne</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Fournisseurs</TableHead>
                            <TableHead>Barème</TableHead>
                            <TableHead>Période</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredCampagnes().map((campagne) => (
                            <TableRow key={campagne.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    {campagne.nom}
                                    {campagne.prioritaire && (
                                      <Badge variant="destructive" className="text-xs">
                                        PRIORITAIRE
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{campagne.description}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={campagne.type === "banque" ? "default" : "secondary"}>
                                  {campagne.type === "banque" ? "Banque" : "Fournisseur"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {campagne.fournisseurs && campagne.fournisseurs.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {campagne.fournisseurs.slice(0, 2).map(f => (
                                      <Badge key={f} variant="outline" className="text-xs">
                                        {f.replace('-', ' ')}
                                      </Badge>
                                    ))}
                                    {campagne.fournisseurs.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{campagne.fournisseurs.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Tous fournisseurs</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium text-green-600">Taux: {campagne.bareme.taux}%</div>
                                  <div>Marge: {campagne.bareme.marge}%</div>
                                  <div>VR: {campagne.bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Début: {campagne.dateDebut.toLocaleDateString()}</div>
                                  <div>Fin: {campagne.dateFin.toLocaleDateString()}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatutColor(campagne)}>
                                  {getStatutText(campagne)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(campagne)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(campagne.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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

export default Campagnes;
