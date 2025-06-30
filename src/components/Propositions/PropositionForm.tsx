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
import { TypeProposition, Convention, Campagne } from "@/types/leasing";
import { Calculator, User, Package, FileText } from "lucide-react";

interface ClientInfo {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

interface MaterialInfo {
  designation: string;
  prixHT: number;
  tva: number;
}

interface CalculationInfo {
  duree: number;
  apport: number;
  frequencePaiement: "mensuel" | "trimestriel" | "annuel";
}

const defaultClientInfo: ClientInfo = {
  nom: "",
  adresse: "",
  telephone: "",
  email: ""
};

const defaultMaterialInfo: MaterialInfo = {
  designation: "",
  prixHT: 0,
  tva: 0
};

const defaultCalculationInfo: CalculationInfo = {
  duree: 36,
  apport: 0,
  frequencePaiement: "mensuel"
};

const PropositionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [typeProposition, setTypeProposition] = useState<TypeProposition | null>(null);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [materialInfo, setMaterialInfo] = useState<MaterialInfo>(defaultMaterialInfo);
  const [calculationInfo, setCalculationInfo] = useState<CalculationInfo>(defaultCalculationInfo);

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
                Matériel
              </TabsTrigger>
              <TabsTrigger value="calculation">
                <Calculator className="h-4 w-4 mr-2" />
                Calcul
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nom">Nom du Client</Label>
                    <Input type="text" id="nom" value={clientInfo.nom} onChange={handleClientInfoChange} />
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
                  <CardTitle>Informations Matériel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="designation">Désignation du Matériel</Label>
                    <Input type="text" id="designation" value={materialInfo.designation} onChange={(e) => setMaterialInfo(prev => ({ ...prev, designation: e.target.value }))} />
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
                  <CardTitle>Informations de Calcul</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
