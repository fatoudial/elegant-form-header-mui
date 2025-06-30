
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
import { Plus, Edit, Trash2, Handshake } from "lucide-react";
import { Convention } from "@/types/leasing";
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
const CONVENTIONS_DEMO: Convention[] = [
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
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement"
];

const Conventions = () => {
  const [conventions, setConventions] = useState<Convention[]>(CONVENTIONS_DEMO);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConvention, setEditingConvention] = useState<Convention | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    fournisseurs: [] as string[],
    taux: "",
    marge: "",
    valeurResiduelle: "",
    dateDebut: "",
    dateFin: "",
    actif: true
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      fournisseurs: [],
      taux: "",
      marge: "",
      valeurResiduelle: "",
      dateDebut: "",
      dateFin: "",
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
      taux: convention.bareme.taux.toString(),
      marge: convention.bareme.marge.toString(),
      valeurResiduelle: convention.bareme.valeurResiduelle.toString(),
      dateDebut: convention.dateDebut.toISOString().split('T')[0],
      dateFin: convention.dateFin ? convention.dateFin.toISOString().split('T')[0] : "",
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
      bareme: {
        taux: parseFloat(formData.taux),
        marge: parseFloat(formData.marge),
        valeurResiduelle: parseFloat(formData.valeurResiduelle)
      },
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      actif: formData.actif
    };

    if (editingConvention) {
      setConventions(prev => prev.map(c => c.id === editingConvention.id ? conventionData : c));
    } else {
      setConventions(prev => [...prev, conventionData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setConventions(prev => prev.filter(c => c.id !== id));
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingConvention ? "Modifier la Convention" : "Nouvelle Convention"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la convention de leasing
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom de la convention *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Véhicules Professionnels"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateDebut">Date de début *</Label>
                        <Input
                          id="dateDebut"
                          type="date"
                          value={formData.dateDebut}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description de la convention..."
                      />
                    </div>

                    <div>
                      <Label>Fournisseurs partenaires *</Label>
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

                    <div>
                      <Label htmlFor="dateFin">Date de fin (optionnelle)</Label>
                      <Input
                        id="dateFin"
                        type="date"
                        value={formData.dateFin}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                      />
                    </div>
                  </div>

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

            <Card>
              <CardHeader>
                <CardTitle>Conventions actives</CardTitle>
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
                    {conventions.map((convention) => (
                      <TableRow key={convention.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{convention.nom}</div>
                            <div className="text-sm text-muted-foreground">{convention.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {convention.fournisseurs.map(f => (
                              <Badge key={f} variant="outline" className="text-xs">
                                {f.replace('-', ' ')}
                              </Badge>
                            ))}
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
                          <Badge variant={convention.actif ? "default" : "secondary"}>
                            {convention.actif ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
                              onClick={() => handleDelete(convention.id)}
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

export default Conventions;
