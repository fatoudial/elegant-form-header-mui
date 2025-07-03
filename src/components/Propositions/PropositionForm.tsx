import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import LeasingTypeSelector from "./LeasingTypeSelector";
import ConventionSelector from "./ConventionSelector";
import CampagneSelector from "./CampagneSelector";
import AmortizationTable from "./AmortizationTable";
import { TypeProposition, Convention, Campagne } from "@/types/leasing";
import { Calculator, User, Package, FileText } from "lucide-react";

interface ClientInfo {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  typeClient: "particulier" | "entreprise" | "association";
}

interface MaterialInfo {
  designation: string;
  prixHT: number;
  tva: number;
  categorie: string;
  fournisseur: string;
}

interface CalculationInfo {
  duree: number;
  apport: number;
  frequencePaiement: "mensuel" | "trimestriel" | "annuel";
  bareme: string;
}

const defaultClientInfo: ClientInfo = {
  nom: "",
  adresse: "",
  telephone: "",
  email: "",
  typeClient: "particulier"
};

const defaultMaterialInfo: MaterialInfo = {
  designation: "",
  prixHT: 0,
  tva: 0,
  categorie: "",
  fournisseur: ""
};

const defaultCalculationInfo: CalculationInfo = {
  duree: 36,
  apport: 0,
  frequencePaiement: "mensuel",
  bareme: ""
};

const PropositionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [typeProposition, setTypeProposition] = useState<TypeProposition | null>(null);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [materialInfo, setMaterialInfo] = useState<MaterialInfo>(defaultMaterialInfo);
  const [calculationInfo, setCalculationInfo] = useState<CalculationInfo>(defaultCalculationInfo);
  const [prestations, setPrestations] = useState<string[]>([]);
  const [showAmortization, setShowAmortization] = useState(false);

  const handleTypePropositionSelect = (type: TypeProposition) => {
    setTypeProposition(type);
    setSelectedConvention(null);
    setSelectedCampagne(null);
    setCurrentStep(2);
  };

  const handleConventionSelect = (convention: Convention) => {
    setSelectedConvention(convention);
    setCurrentStep(3);
  };

  const handleCampagneSelect = (campagne: Campagne) => {
    setSelectedCampagne(campagne);
    setCurrentStep(3);
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setClientInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleMaterialInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue = parseFloat(value);
    setMaterialInfo(prev => ({ ...prev, [id]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleCalculationInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setCalculationInfo(prev => ({ ...prev, [id]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleFrequencyChange = (value: "mensuel" | "trimestriel" | "annuel") => {
    setCalculationInfo(prev => ({ ...prev, frequencePaiement: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <LeasingTypeSelector
            selectedType={typeProposition}
            onTypeSelect={handleTypePropositionSelect}
            onContinue={() => setCurrentStep(2)}
          />
        );

      case 2:
        if (typeProposition === "convention") {
          return (
            <ConventionSelector
              selectedConvention={selectedConvention}
              onConventionSelect={handleConventionSelect}
            />
          );
        } else if (typeProposition === "campagne") {
          return (
            <CampagneSelector
              selectedCampagne={selectedCampagne}
              onCampagneSelect={handleCampagneSelect}
            />
          );
        } else {
          // Type standard - passer directement à l'étape 3
          setCurrentStep(3);
          return null;
        }

      case 3:
        return (
          <Tabs defaultValue="client" className="w-full">
            <TabsList>
              <TabsTrigger value="client">
                <User className="h-4 w-4 mr-2" />
                Client
              </TabsTrigger>
              <TabsTrigger value="materials">
                <Package className="h-4 w-4 mr-2" />
                Produit
              </TabsTrigger>
              <TabsTrigger value="calculation">
                <Calculator className="h-4 w-4 mr-2" />
                Barème
              </TabsTrigger>
              <TabsTrigger value="prestations">
                <FileText className="h-4 w-4 mr-2" />
                Prestations
              </TabsTrigger>
              <TabsTrigger value="amortissement">
                <Calculator className="h-4 w-4 mr-2" />
                Amortissement
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom du Client</Label>
                      <Input type="text" id="nom" value={clientInfo.nom} onChange={handleClientInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="typeClient">Type de Client</Label>
                      <Select value={clientInfo.typeClient} onValueChange={(value: "particulier" | "entreprise" | "association") => setClientInfo(prev => ({ ...prev, typeClient: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particulier">Particulier</SelectItem>
                          <SelectItem value="entreprise">Entreprise</SelectItem>
                          <SelectItem value="association">Association</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Textarea id="adresse" value={clientInfo.adresse} onChange={handleClientInfoChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input type="tel" id="telephone" value={clientInfo.telephone} onChange={handleClientInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" value={clientInfo.email} onChange={handleClientInfoChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Matériel & Produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="designation">Désignation du Matériel</Label>
                    <Input type="text" id="designation" value={materialInfo.designation} onChange={(e) => setMaterialInfo(prev => ({ ...prev, designation: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select value={materialInfo.categorie} onValueChange={(value) => setMaterialInfo(prev => ({ ...prev, categorie: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vehicules">Véhicules</SelectItem>
                          <SelectItem value="materiels-industriels">Matériels Industriels</SelectItem>
                          <SelectItem value="equipements-bureautique">Équipements Bureautique</SelectItem>
                          <SelectItem value="equipements-medicaux">Équipements Médicaux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fournisseur">Fournisseur</Label>
                      <Select value={materialInfo.fournisseur} onValueChange={(value) => setMaterialInfo(prev => ({ ...prev, fournisseur: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="babacar-fils">Babacar & Fils</SelectItem>
                          <SelectItem value="senegal-auto">Sénégal Auto</SelectItem>
                          <SelectItem value="sonacos">Sonacos</SelectItem>
                          <SelectItem value="afrique-materiel">Afrique Matériel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prixHT">Prix HT</Label>
                      <Input type="number" id="prixHT" value={materialInfo.prixHT} onChange={handleMaterialInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="tva">TVA (%)</Label>
                      <Input type="number" id="tva" value={materialInfo.tva} onChange={handleMaterialInfoChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calculation">
              <Card>
                <CardHeader>
                  <CardTitle>Barème & Calculs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bareme">Barème à appliquer</Label>
                    <Select value={calculationInfo.bareme} onValueChange={(value) => setCalculationInfo(prev => ({ ...prev, bareme: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un barème" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Barème Standard</SelectItem>
                        <SelectItem value="preferentiel">Barème Préférentiel</SelectItem>
                        <SelectItem value="convention">Barème Convention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duree">Durée (mois)</Label>
                      <Input type="number" id="duree" value={calculationInfo.duree} onChange={handleCalculationInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="apport">Apport (%)</Label>
                      <Input type="number" id="apport" value={calculationInfo.apport} onChange={handleCalculationInfoChange} />
                    </div>
                  </div>
                  <div>
                    <Label>Fréquence de Paiement</Label>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant={calculationInfo.frequencePaiement === "mensuel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("mensuel")}
                      >
                        Mensuel
                      </Button>
                      <Button
                        variant={calculationInfo.frequencePaiement === "trimestriel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("trimestriel")}
                      >
                        Trimestriel
                      </Button>
                      <Button
                        variant={calculationInfo.frequencePaiement === "annuel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("annuel")}
                      >
                        Annuel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prestations">
              <Card>
                <CardHeader>
                  <CardTitle>Prestations Complémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Services inclus</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Assurance", "Maintenance", "Extension de garantie", "Formation", "Installation", "Support technique"].map(prestation => (
                        <div key={prestation} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={prestation}
                            checked={prestations.includes(prestation)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPrestations([...prestations, prestation]);
                              } else {
                                setPrestations(prestations.filter(p => p !== prestation));
                              }
                            }}
                          />
                          <Label htmlFor={prestation}>{prestation}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="amortissement">
              {showAmortization ? (
                <AmortizationTable 
                  montant={materialInfo.prixHT + (materialInfo.prixHT * materialInfo.tva / 100)}
                  duree={calculationInfo.duree}
                  taux={7.5}
                  className="w-full"
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Tableau d'Amortissement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Générez le tableau d'amortissement basé sur vos paramètres de financement.
                      </p>
                      <Button onClick={() => setShowAmortization(true)}>
                        Générer le tableau d'amortissement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepContent()}
    </div>
  );
};

export default PropositionForm;
