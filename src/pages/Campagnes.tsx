
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
import { Plus, Edit, Trash2, Zap } from "lucide-react";
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

// Données de démonstration
const CAMPAGNES_DEMO: Campagne[] = [
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
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement"
];

const Campagnes = () => {
  const [campagnes, setCampagnes] = useState<Campagne[]>(CAMPAGNES_DEMO);
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
    actif: true,
    prioritaire: true
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
      actif: true,
      prioritaire: true
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
      actif: campagne.actif,
      prioritaire: campagne.prioritaire
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const campagneData: Campagne = {
      id: editingCampagne?.id || `camp-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      type: formData.type,
      fournisseurs: formData.type === "banque" ? undefined : formData.fournisseurs,
      bareme: {
        taux: parseFloat(formData.taux),
        marge: parseFloat(formData.marge),
        valeurResiduelle: parseFloat(formData.valeurResiduelle)
      },
      dateDebut: new Date(formData.dateDebut),
      dateFin: new Date(formData.dateFin),
      actif: formData.actif,
      prioritaire: formData.prioritaire
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
                  Gérez les campagnes promotionnelles de leasing (taux prioritaires)
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCampagne ? "Modifier la Campagne" : "Nouvelle Campagne"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la campagne promotionnelle
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom de la campagne *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Campagne Été 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type de campagne *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: "fournisseur" | "banque") => 
                            setFormData(prev => ({ ...prev, type: value, fournisseurs: [] }))}
                        >
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
                      />
                    </div>

                    {formData.type === "fournisseur" && (
                      <div>
                        <Label>Fournisseurs concernés *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
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
                              {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.type === "banque" && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                          🏦 <strong>Campagne Banque :</strong> Tous les fournisseurs sont éligibles avec ce barème exceptionnel
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taux">Taux exceptionnel (%)</Label>
                        <Input
                          id="taux"
                          type="number"
                          step="0.1"
                          value={formData.taux}
                          onChange={(e) => setFormData(prev => ({ ...prev, taux: e.target.value }))}
                          placeholder="4.5"
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
                          placeholder="1.0"
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

            <Card>
              <CardHeader>
                <CardTitle>Campagnes en cours</CardTitle>
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
                    {campagnes.map((campagne) => (
                      <TableRow key={campagne.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {campagne.nom}
                              {campagne.prioritaire && (
                                <Badge variant="destructive" className="text-xs">Prioritaire</Badge>
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
                          {campagne.type === "banque" ? (
                            <Badge variant="outline" className="text-xs">Tous fournisseurs</Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {campagne.fournisseurs?.map(f => (
                                <Badge key={f} variant="outline" className="text-xs">
                                  {f.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-red-600 font-medium">Taux: {campagne.bareme.taux}%</div>
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
                          <Badge variant={campagne.actif ? "default" : "secondary"}>
                            {campagne.actif ? "Active" : "Inactive"}
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Campagnes;
