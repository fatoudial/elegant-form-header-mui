
import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { BaremeStandard } from "@/types/leasing";
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

// Données de démonstration
const BAREME_DEMO: BaremeStandard = {
  taux: 7.0,
  marge: 3.0,
  valeurResiduelle: 2.5
};

const Bareme = () => {
  const [bareme, setBareme] = useState<BaremeStandard>(BAREME_DEMO);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    taux: "",
    marge: "",
    valeurResiduelle: ""
  });

  const handleEdit = () => {
    setFormData({
      taux: bareme.taux.toString(),
      marge: bareme.marge.toString(),
      valeurResiduelle: bareme.valeurResiduelle.toString()
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newBareme: BaremeStandard = {
      taux: parseFloat(formData.taux),
      marge: parseFloat(formData.marge),
      valeurResiduelle: parseFloat(formData.valeurResiduelle)
    };
    setBareme(newBareme);
    setIsDialogOpen(false);
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
                  Barème Standard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Configuration du barème de base appliqué par défaut
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le Barème
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le Barème Standard</DialogTitle>
                    <DialogDescription>
                      Ajustez les paramètres du barème de base
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taux">Taux de base (%)</Label>
                      <Input
                        id="taux"
                        type="number"
                        step="0.1"
                        value={formData.taux}
                        onChange={(e) => setFormData(prev => ({ ...prev, taux: e.target.value }))}
                        placeholder="7.0"
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
                        placeholder="3.0"
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
                        placeholder="2.5"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Barème Actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {bareme.taux}%
                    </div>
                    <div className="text-sm text-muted-foreground">Taux de Base</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {bareme.marge}%
                    </div>
                    <div className="text-sm text-muted-foreground">Marge</div>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {bareme.valeurResiduelle}%
                    </div>
                    <div className="text-sm text-muted-foreground">Valeur Résiduelle</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">ℹ️ Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Ce barème s'applique automatiquement pour toutes les propositions de type "Standard". 
                    Les conventions et campagnes ont leurs propres barèmes qui prennent la priorité sur ce barème de base.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Bareme;
