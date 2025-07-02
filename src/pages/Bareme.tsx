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
import { Plus, Edit, Trash2, Percent, Eye, Power, PowerOff } from "lucide-react";
import { BaremeComplet } from "@/types/leasing";
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

// Demo data
const BAREMES_DEMO: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard Crédit-Bail",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    actif: true
  },
  {
    id: "bar-std-002",
    nom: "Barème Standard LLD",
    type: "standard",
    taux: 6.8,
    marge: 2.8,
    valeurResiduelle: 0,
    typologie: "LLD",
    dateCreation: new Date("2024-01-01"),
    actif: true
  }
];

// Options pour les selects
const FOURNISSEURS_OPTIONS = ["Sonacos", "Babacar & Fils", "Sénégal Auto", "Afrique Matériel"];
const MATERIELS_OPTIONS = ["Tracteurs", "Véhicules Utilitaires", "Machines Industrielles", "Équipements Agricoles"];

const CRITERES_PAR_TYPE = {
  segment: ["PME", "Grand Compte", "Corporate", "Particulier", "Micro-entreprise"],
  secteur: ["Agriculture et agroalimentaire", "Transport et logistique", "Industrie manufacturière", "Commerce et distribution", "Services aux entreprises", "BTP et construction", "Santé et services sociaux", "Education et formation", "Technologies et télécommunications", "Tourisme et hôtellerie"],
  profession: ["Médecin", "Avocat", "Architecte", "Comptable", "Ingénieur", "Pharmacien", "Vétérinaire", "Dentiste", "Notaire", "Expert-comptable"],
  groupe_client: ["Groupe A", "Groupe Premium", "Partenaires", "VIP", "Institutionnels"]
};

const Bareme = () => {
  const [baremes, setBaremes] = useState<BaremeComplet[]>(BAREMES_DEMO);
  const [isBaremeDialogOpen, setIsBaremeDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingBareme, setEditingBareme] = useState<BaremeComplet | null>(null);
  const [viewingBareme, setViewingBareme] = useState<BaremeComplet | null>(null);
  
  const [baremeForm, setBaremeForm] = useState({
    nom: "",
    typologie: "Crédit-Bail",
    type: "standard" as "standard" | "derogatoire",
    taux: "",
    duree: "",
    periodicite: "mensuel",
    typeEcheancier: "constant",
    marge: "",
    valeurResiduelle: "",
    valeurReprise: "",
    premierLoyerMajore: "",
    premierLoyerMajoreType: "sup" as "sup" | "inf",
    fournisseursPartenaires: [] as string[],
    materiels: [] as string[],
    conditions: [] as any[]
  });

  const [conditionForm, setConditionForm] = useState({
    nom: "",
    type: "segment" as "segment" | "secteur" | "profession" | "groupe_client",
    criteres: [] as string[],
    description: ""
  });

  const resetBaremeForm = () => {
    setBaremeForm({
      nom: "",
      typologie: "Crédit-Bail",
      type: "standard",
      taux: "",
      duree: "",
      periodicite: "mensuel",
      typeEcheancier: "constant",
      marge: "",
      valeurResiduelle: "",
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerMajoreType: "sup",
      fournisseursPartenaires: [],
      materiels: [],
      conditions: []
    });
    setEditingBareme(null);
  };

  const addCondition = () => {
    if (conditionForm.nom && conditionForm.criteres.length > 0) {
      const newCondition = {
        id: `cond-${Date.now()}`,
        ...conditionForm
      };
      setBaremeForm(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition]
      }));
      setConditionForm({
        nom: "",
        type: "segment",
        criteres: [],
        description: ""
      });
    }
  };

  const removeCondition = (index: number) => {
    setBaremeForm(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBareme = () => {
    const baremeData: BaremeComplet = {
      id: editingBareme?.id || `bar-${Date.now()}`,
      nom: baremeForm.nom,
      type: baremeForm.type,
      taux: parseFloat(baremeForm.taux),
      marge: parseFloat(baremeForm.marge),
      valeurResiduelle: baremeForm.typologie === "LOA" 
        ? parseFloat(baremeForm.valeurReprise || "0")
        : parseFloat(baremeForm.valeurResiduelle),
      typologie: baremeForm.typologie,
      conditions: baremeForm.type === "derogatoire" ? baremeForm.conditions : undefined,
      dateCreation: editingBareme?.dateCreation || new Date(),
      dateModification: editingBareme ? new Date() : undefined,
      actif: true
    };

    if (editingBareme) {
      setBaremes(prev => prev.map(b => b.id === editingBareme.id ? baremeData : b));
    } else {
      setBaremes(prev => [...prev, baremeData]);
    }

    setIsBaremeDialogOpen(false);
    resetBaremeForm();
  };

  const handleToggleBaremeStatus = (id: string) => {
    setBaremes(prev => prev.map(b => 
      b.id === id ? { ...b, actif: !b.actif, dateModification: new Date() } : b
    ));
  };

  const handleViewBareme = (bareme: BaremeComplet) => {
    setViewingBareme(bareme);
    setIsDetailDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    return type === "standard" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
  };

  const getTypologieColor = (typologie: string) => {
    return typologie === "Crédit-Bail" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800";
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
                  <Percent className="h-8 w-8 text-indigo-500" />
                  Gestion des Barèmes
                </h1>
                <p className="text-muted-foreground mt-2">
                  Configuration et gestion des barèmes de financement
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liste des Barèmes</h2>
              <Dialog open={isBaremeDialogOpen} onOpenChange={setIsBaremeDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetBaremeForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Barème
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBareme ? "Modifier le Barème" : "Nouveau Barème"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les paramètres du barème de financement
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Nom */}
                    <div>
                      <Label htmlFor="nom">Nom du barème *</Label>
                      <Input
                        id="nom"
                        value={baremeForm.nom}
                        onChange={(e) => setBaremeForm(prev => ({ ...prev, nom: e.target.value }))}
                        placeholder="Ex: Barème PME Privilégiées"
                      />
                    </div>

                    {/* Typologie AVANT Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="typologie">Typologie *</Label>
                        <Select value={baremeForm.typologie} onValueChange={(value) => setBaremeForm(prev => ({ ...prev, typologie: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Crédit-Bail">Crédit-Bail / LOA</SelectItem>
                            <SelectItem value="LLD">LLD (Location Longue Durée)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">Type *</Label>
                        <Select value={baremeForm.type} onValueChange={(value: "standard" | "derogatoire") => setBaremeForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="derogatoire">Dérogatoire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Champs selon le type */}
                    {baremeForm.type === "standard" ? (
                      // Standard: taux, durée, périodicité, type échéancier, valeur résiduelle
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="taux">Taux (%)</Label>
                            <Input
                              id="taux"
                              type="number"
                              step="0.1"
                              value={baremeForm.taux}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, taux: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="duree">Durée (mois)</Label>
                            <Input
                              id="duree"
                              type="number"
                              value={baremeForm.duree}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, duree: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="periodicite">Périodicité</Label>
                            <Select value={baremeForm.periodicite} onValueChange={(value) => setBaremeForm(prev => ({ ...prev, periodicite: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensuel">Mensuel</SelectItem>
                                <SelectItem value="trimestriel">Trimestriel</SelectItem>
                                <SelectItem value="annuel">Annuel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="typeEcheancier">Type échéancier</Label>
                            <Select value={baremeForm.typeEcheancier} onValueChange={(value) => setBaremeForm(prev => ({ ...prev, typeEcheancier: value }))}>
                              <SelectTrigger>
                                <SelectValue />
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
                              {baremeForm.typologie === "LOA" ? "Valeur de reprise (%)" : "Valeur résiduelle (%)"}
                            </Label>
                            <Input
                              id="valeurResiduelle"
                              type="number"
                              step="0.1"
                              value={baremeForm.typologie === "LOA" ? baremeForm.valeurReprise : baremeForm.valeurResiduelle}
                              onChange={(e) => setBaremeForm(prev => ({ 
                                ...prev, 
                                [baremeForm.typologie === "LOA" ? "valeurReprise" : "valeurResiduelle"]: e.target.value 
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Dérogatoire: nom, typologie, type, taux, durée, valeur résiduelle, périodicité, échéancier, 1er loyer majoré
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="taux">Taux (%)</Label>
                            <Input
                              id="taux"
                              type="number"
                              step="0.1"
                              value={baremeForm.taux}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, taux: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="duree">Durée (mois)</Label>
                            <Input
                              id="duree"
                              type="number"
                              value={baremeForm.duree}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, duree: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="valeurResiduelle">
                              {baremeForm.typologie === "LOA" ? "Valeur de reprise (%)" : "Valeur résiduelle (%)"}
                            </Label>
                            <Input
                              id="valeurResiduelle"
                              type="number"
                              step="0.1"
                              value={baremeForm.typologie === "LOA" ? baremeForm.valeurReprise : baremeForm.valeurResiduelle}
                              onChange={(e) => setBaremeForm(prev => ({ 
                                ...prev, 
                                [baremeForm.typologie === "LOA" ? "valeurReprise" : "valeurResiduelle"]: e.target.value 
                              }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="periodicite">Périodicité</Label>
                            <Select value={baremeForm.periodicite} onValueChange={(value) => setBaremeForm(prev => ({ ...prev, periodicite: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensuel">Mensuel</SelectItem>
                                <SelectItem value="trimestriel">Trimestriel</SelectItem>
                                <SelectItem value="annuel">Annuel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="typeEcheancier">Type échéancier</Label>
                            <Select value={baremeForm.typeEcheancier} onValueChange={(value) => setBaremeForm(prev => ({ ...prev, typeEcheancier: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="constant">Constant</SelectItem>
                                <SelectItem value="progressif">Progressif</SelectItem>
                                <SelectItem value="degressif">Dégressif</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* 1er Loyer Majoré */}
                        <div>
                          <Label>1er Loyer Majoré</Label>
                          <div className="flex gap-2">
                            <Select value={baremeForm.premierLoyerMajoreType} onValueChange={(value: "sup" | "inf") => setBaremeForm(prev => ({ ...prev, premierLoyerMajoreType: value }))}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sup">≥</SelectItem>
                                <SelectItem value="inf">≤</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Valeur"
                              value={baremeForm.premierLoyerMajore}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, premierLoyerMajore: e.target.value }))}
                            />
                          </div>
                        </div>

                        {/* Fournisseurs Partenaires */}
                        <div>
                          <Label>Fournisseurs Partenaires</Label>
                          <Select 
                            value="" 
                            onValueChange={(value) => {
                              if (!baremeForm.fournisseursPartenaires.includes(value)) {
                                setBaremeForm(prev => ({ 
                                  ...prev, 
                                  fournisseursPartenaires: [...prev.fournisseursPartenaires, value] 
                                }));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un fournisseur" />
                            </SelectTrigger>
                            <SelectContent>
                              {FOURNISSEURS_OPTIONS.map(fournisseur => (
                                <SelectItem key={fournisseur} value={fournisseur}>{fournisseur}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {baremeForm.fournisseursPartenaires.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {baremeForm.fournisseursPartenaires.map((fournisseur, index) => (
                                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => setBaremeForm(prev => ({ ...prev, fournisseursPartenaires: prev.fournisseursPartenaires.filter(f => f !== fournisseur) }))}>
                                  {fournisseur} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Matériels */}
                        <div>
                          <Label>Matériels</Label>
                          <Select 
                            value="" 
                            onValueChange={(value) => {
                              if (!baremeForm.materiels.includes(value)) {
                                setBaremeForm(prev => ({ 
                                  ...prev, 
                                  materiels: [...prev.materiels, value] 
                                }));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un matériel" />
                            </SelectTrigger>
                            <SelectContent>
                              {MATERIELS_OPTIONS.map(materiel => (
                                <SelectItem key={materiel} value={materiel}>{materiel}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {baremeForm.materiels.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {baremeForm.materiels.map((materiel, index) => (
                                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => setBaremeForm(prev => ({ ...prev, materiels: prev.materiels.filter(m => m !== materiel) }))}>
                                  {materiel} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Conditions */}
                        <div>
                          <Label>Conditions Applicables</Label>
                          <Card className="p-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="condNom">Nom de la condition</Label>
                                  <Input
                                    id="condNom"
                                    value={conditionForm.nom}
                                    onChange={(e) => setConditionForm(prev => ({ ...prev, nom: e.target.value }))}
                                    placeholder="Ex: Segments Privilégiés"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="condType">Type de critère</Label>
                                  <Select value={conditionForm.type} onValueChange={(value: any) => setConditionForm(prev => ({ ...prev, type: value, criteres: [] }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="segment">Segment</SelectItem>
                                      <SelectItem value="secteur">Secteur d'activité</SelectItem>
                                      <SelectItem value="profession">Profession</SelectItem>
                                      <SelectItem value="groupe_client">Groupe de clients</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Critères</Label>
                                <Select 
                                  value="" 
                                  onValueChange={(value) => {
                                    if (!conditionForm.criteres.includes(value)) {
                                      setConditionForm(prev => ({ 
                                        ...prev, 
                                        criteres: [...prev.criteres, value] 
                                      }));
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un critère" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CRITERES_PAR_TYPE[conditionForm.type].map(critere => (
                                      <SelectItem key={critere} value={critere}>{critere}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {conditionForm.criteres.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {conditionForm.criteres.map((critere, index) => (
                                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => setConditionForm(prev => ({ ...prev, criteres: prev.criteres.filter(c => c !== critere) }))}>
                                        {critere} ×
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="condDescription">Description</Label>
                                <Textarea
                                  id="condDescription"
                                  value={conditionForm.description}
                                  onChange={(e) => setConditionForm(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Description de la condition..."
                                />
                              </div>

                              <Button type="button" onClick={addCondition} variant="outline" size="sm">
                                Ajouter la condition
                              </Button>
                            </div>
                          </Card>

                          {/* Liste des conditions ajoutées */}
                          {baremeForm.conditions.length > 0 && (
                            <div className="space-y-2 mt-4">
                              <h4 className="text-sm font-medium">Conditions ajoutées :</h4>
                              {baremeForm.conditions.map((condition, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                  <div>
                                    <span className="font-medium">{condition.nom}</span>
                                    <span className="text-sm text-muted-foreground ml-2">({condition.type})</span>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBaremeDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveBareme}>
                      {editingBareme ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Barème</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Typologie</TableHead>
                      <TableHead>Taux</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {baremes.map((bareme) => (
                      <TableRow key={bareme.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{bareme.nom}</div>
                            <div className="text-xs text-muted-foreground">
                              Créé le {bareme.dateCreation.toLocaleDateString()}
                              {bareme.dateModification && (
                                <span> • Modifié le {bareme.dateModification.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(bareme.type)}>
                            {bareme.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypologieColor(bareme.typologie || "")}>
                            {bareme.typologie}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Taux: {bareme.taux}%</div>
                            <div>Marge: {bareme.marge}%</div>
                            <div>VR: {bareme.valeurResiduelle}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {bareme.conditions && bareme.conditions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {bareme.conditions.map(condition => (
                                <Badge key={condition.id} variant="outline" className="text-xs">
                                  {condition.nom}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Aucune</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={bareme.actif ? "default" : "secondary"}>
                            {bareme.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewBareme(bareme)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleBaremeStatus(bareme.id)}
                              className={bareme.actif ? "text-red-600" : "text-green-600"}
                            >
                              {bareme.actif ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le barème</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le barème "{bareme.nom}" ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => setBaremes(prev => prev.filter(b => b.id !== bareme.id))}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Barème Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Détails du Barème</DialogTitle>
                </DialogHeader>
                {viewingBareme && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                        <p className="font-medium">{viewingBareme.nom}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                        <Badge className={getTypeColor(viewingBareme.type)}>
                          {viewingBareme.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Typologie</Label>
                        <Badge className={getTypologieColor(viewingBareme.typologie || "")}>
                          {viewingBareme.typologie}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                        <Badge variant={viewingBareme.actif ? "default" : "secondary"}>
                          {viewingBareme.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Paramètres Financiers</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-center p-4 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">{viewingBareme.taux}%</div>
                          <div className="text-sm text-muted-foreground">Taux</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">{viewingBareme.marge}%</div>
                          <div className="text-sm text-muted-foreground">Marge</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded">
                          <div className="text-2xl font-bold text-orange-600">{viewingBareme.valeurResiduelle}%</div>
                          <div className="text-sm text-muted-foreground">
                            {viewingBareme.typologie === "LOA" ? "Valeur de Reprise" : "Valeur Résiduelle"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewingBareme.conditions && viewingBareme.conditions.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Conditions Applicables</Label>
                        <div className="space-y-2 mt-2">
                          {viewingBareme.conditions.map(condition => (
                            <Card key={condition.id}>
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{condition.nom}</h4>
                                    <p className="text-sm text-muted-foreground">{condition.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {condition.criteres.map((critere, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {critere}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {condition.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date de création</Label>
                        <p>{viewingBareme.dateCreation.toLocaleDateString()}</p>
                      </div>
                      {viewingBareme.dateModification && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Dernière modification</Label>
                          <p>{viewingBareme.dateModification.toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Fermer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Bareme;