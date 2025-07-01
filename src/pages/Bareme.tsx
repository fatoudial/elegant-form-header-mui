
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
import { Plus, Edit, Trash2, Percent, Settings, CheckCircle, Eye, Power, PowerOff } from "lucide-react";
import { BaremeComplet, ConditionBareme } from "@/types/leasing";
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

// Extended demo data with new typologie field
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
  },
  {
    id: "bar-der-001", 
    nom: "Barème PME Privilégiées",
    type: "derogatoire",
    taux: 6.2,
    marge: 2.5,
    valeurResiduelle: 2.0,
    typologie: "Crédit-Bail",
    conditions: [
      {
        id: "cond-001",
        nom: "Segment LVA",
        type: "segment",
        criteres: ["PME", "Grand Compte"],
        description: "Segments clients privilégiés"
      }
    ],
    dateCreation: new Date("2024-01-15"),
    actif: true
  },
  {
    id: "bar-der-002",
    nom: "Barème Agriculture Premium",
    type: "derogatoire",
    taux: 5.8,
    marge: 2.2,
    valeurResiduelle: 1.8,
    typologie: "Crédit-Bail",
    conditions: [
      {
        id: "cond-002",
        nom: "Secteur Agriculture",
        type: "secteur",
        criteres: ["Agriculture", "Élevage", "Pêche"],
        description: "Secteurs agricoles prioritaires"
      }
    ],
    dateCreation: new Date("2024-02-01"),
    actif: false
  }
];

const CONDITIONS_DEMO: ConditionBareme[] = [
  {
    id: "cond-seg-001",
    nom: "Segments Privilégiés",
    type: "segment", 
    criteres: ["PME", "Grand Compte", "Corporate"],
    description: "Segments clients avec conditions préférentielles (LVA - BKNOM)"
  },
  {
    id: "cond-sec-001",
    nom: "Secteurs Prioritaires",
    type: "secteur",
    criteres: ["Agriculture", "Transport", "Industrie", "Commerce"],
    description: "Secteurs d'activité prioritaires (LVA - BKNOM)"
  },
  {
    id: "cond-prof-001",
    nom: "Professions Libérales",
    type: "profession",
    criteres: ["Médecin", "Avocat", "Architecte", "Comptable"],
    description: "Professions libérales (LVA - BKNOM)"
  },
  {
    id: "cond-grp-001",
    nom: "Groupes Clients VIP",
    type: "groupe_client",
    criteres: ["Groupe A", "Groupe Premium", "Partenaires"],
    description: "Groupes de clients privilégiés (LVB - BKGRP)"
  }
];

const Bareme = () => {
  const [baremes, setBaremes] = useState<BaremeComplet[]>(BAREMES_DEMO);
  const [conditions, setConditions] = useState<ConditionBareme[]>(CONDITIONS_DEMO);
  const [isBaremeDialogOpen, setIsBaremeDialogOpen] = useState(false);
  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingBareme, setEditingBareme] = useState<BaremeComplet | null>(null);
  const [editingCondition, setEditingCondition] = useState<ConditionBareme | null>(null);
  const [viewingBareme, setViewingBareme] = useState<BaremeComplet | null>(null);
  
  const [baremeForm, setBaremeForm] = useState({
    nom: "",
    type: "standard" as "standard" | "derogatoire",
    taux: "",
    marge: "",
    valeurResiduelle: "",
    typologie: "Crédit-Bail",
    conditionIds: [] as string[]
  });

  const [conditionForm, setConditionForm] = useState({
    nom: "",
    type: "segment" as "segment" | "secteur" | "profession" | "groupe_client",
    criteres: "",
    description: ""
  });

  const resetBaremeForm = () => {
    setBaremeForm({
      nom: "",
      type: "standard",
      taux: "",
      marge: "",
      valeurResiduelle: "",
      typologie: "Crédit-Bail",
      conditionIds: []
    });
    setEditingBareme(null);
  };

  const resetConditionForm = () => {
    setConditionForm({
      nom: "",
      type: "segment",
      criteres: "",
      description: ""
    });
    setEditingCondition(null);
  };

  const handleSaveBareme = () => {
    const baremeData: BaremeComplet = {
      id: editingBareme?.id || `bar-${Date.now()}`,
      nom: baremeForm.nom,
      type: baremeForm.type,
      taux: parseFloat(baremeForm.taux),
      marge: parseFloat(baremeForm.marge),
      valeurResiduelle: parseFloat(baremeForm.valeurResiduelle),
      typologie: baremeForm.typologie,
      conditions: baremeForm.type === "derogatoire" ? 
        conditions.filter(c => baremeForm.conditionIds.includes(c.id)) : undefined,
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

  const handleSaveCondition = () => {
    const conditionData: ConditionBareme = {
      id: editingCondition?.id || `cond-${Date.now()}`,
      nom: conditionForm.nom,
      type: conditionForm.type,
      criteres: conditionForm.criteres.split(',').map(c => c.trim()),
      description: conditionForm.description
    };

    if (editingCondition) {
      setConditions(prev => prev.map(c => c.id === editingCondition.id ? conditionData : c));
    } else {
      setConditions(prev => [...prev, conditionData]);
    }

    setIsConditionDialogOpen(false);
    resetConditionForm();
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

            <Tabs defaultValue="baremes" className="space-y-6">
              <TabsList>
                <TabsTrigger value="baremes">Barèmes</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="baremes">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Liste des Barèmes</h2>
                  <Dialog open={isBaremeDialogOpen} onOpenChange={setIsBaremeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetBaremeForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Barème
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingBareme ? "Modifier le Barème" : "Nouveau Barème"}
                        </DialogTitle>
                        <DialogDescription>
                          Configurez les paramètres du barème de financement
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom">Nom du barème *</Label>
                            <Input
                              id="nom"
                              value={baremeForm.nom}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, nom: e.target.value }))}
                              placeholder="Ex: Barème PME Privilégiées"
                            />
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
                            <Label htmlFor="marge">Marge (%)</Label>
                            <Input
                              id="marge"
                              type="number"
                              step="0.1"
                              value={baremeForm.marge}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, marge: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="valeurResiduelle">Valeur Résiduelle (%)</Label>
                            <Input
                              id="valeurResiduelle"
                              type="number"
                              step="0.1"
                              value={baremeForm.valeurResiduelle}
                              onChange={(e) => setBaremeForm(prev => ({ ...prev, valeurResiduelle: e.target.value }))}
                            />
                          </div>
                        </div>

                        {baremeForm.type === "derogatoire" && (
                          <div>
                            <Label>Conditions applicables</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {conditions.map(condition => (
                                <div
                                  key={condition.id}
                                  className={`p-2 border rounded cursor-pointer transition-colors ${
                                    baremeForm.conditionIds.includes(condition.id)
                                      ? "bg-primary/10 border-primary"
                                      : "hover:bg-accent"
                                  }`}
                                  onClick={() => setBaremeForm(prev => ({
                                    ...prev,
                                    conditionIds: prev.conditionIds.includes(condition.id)
                                      ? prev.conditionIds.filter(id => id !== condition.id)
                                      : [...prev.conditionIds, condition.id]
                                  }))}
                                >
                                  <div className="text-sm font-medium">{condition.nom}</div>
                                  <div className="text-xs text-muted-foreground">{condition.type}</div>
                                </div>
                              ))}
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
                                  onClick={() => {
                                    setEditingBareme(bareme);
                                    setBaremeForm({
                                      nom: bareme.nom,
                                      type: bareme.type,
                                      taux: bareme.taux.toString(),
                                      marge: bareme.marge.toString(),
                                      valeurResiduelle: bareme.valeurResiduelle.toString(),
                                      typologie: bareme.typologie || "Crédit-Bail",
                                      conditionIds: bareme.conditions?.map(c => c.id) || []
                                    });
                                    setIsBaremeDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
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
              </TabsContent>

              <TabsContent value="conditions">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Conditions Clients</h2>
                  <Dialog open={isConditionDialogOpen} onOpenChange={setIsConditionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetConditionForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Condition
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCondition ? "Modifier la Condition" : "Nouvelle Condition"}
                        </DialogTitle>
                        <DialogDescription>
                          Définissez les critères d'éligibilité pour les barèmes dérogatoires
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="condNom">Nom de la condition *</Label>
                          <Input
                            id="condNom"
                            value={conditionForm.nom}
                            onChange={(e) => setConditionForm(prev => ({ ...prev, nom: e.target.value }))}
                            placeholder="Ex: Segments Privilégiés"
                          />
                        </div>

                        <div>
                          <Label htmlFor="condType">Type de critère *</Label>
                          <Select value={conditionForm.type} onValueChange={(value: any) => setConditionForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="segment">Segment (LVA)</SelectItem>
                              <SelectItem value="secteur">Secteur d'activité (LVA)</SelectItem>
                              <SelectItem value="profession">Profession (LVA)</SelectItem>
                              <SelectItem value="groupe_client">Groupe de clients (LVB)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="criteres">Critères (séparés par des virgules) *</Label>
                          <Input
                            id="criteres"
                            value={conditionForm.criteres}
                            onChange={(e) => setConditionForm(prev => ({ ...prev, criteres: e.target.value }))}
                            placeholder="Ex: PME, Grand Compte, Corporate"
                          />
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
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConditionDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleSaveCondition}>
                          {editingCondition ? "Modifier" : "Créer"}
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
                          <TableHead>Condition</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Critères</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conditions.map((condition) => (
                          <TableRow key={condition.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{condition.nom}</div>
                                {condition.description && (
                                  <div className="text-sm text-muted-foreground">{condition.description}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {condition.type.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {condition.criteres.map((critere, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {critere}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCondition(condition);
                                    setConditionForm({
                                      nom: condition.nom,
                                      type: condition.type,
                                      criteres: condition.criteres.join(', '),
                                      description: condition.description || ""
                                    });
                                    setIsConditionDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setConditions(prev => prev.filter(c => c.id !== condition.id))}
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
            </Tabs>

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
                          <div className="text-sm text-muted-foreground">Valeur Résiduelle</div>
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
