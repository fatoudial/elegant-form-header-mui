
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypeProposition } from "@/types/leasing";
import { Building, Zap, Star } from "lucide-react";

interface LeasingTypeSelectorProps {
  selectedType: TypeProposition | null;
  onTypeSelect: (type: TypeProposition) => void;
  onContinue: () => void;
}

const LeasingTypeSelector = ({ selectedType, onTypeSelect, onContinue }: LeasingTypeSelectorProps) => {
  return (
    <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Type de proposition de leasing</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Sélectionnez le type de financement pour cette proposition
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Standard */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === "standard" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onTypeSelect("standard")}
        >
          <CardContent className="pt-6 text-center p-4 md:p-6">
            <div className="mb-4">
              <Building className="h-8 w-8 md:h-12 md:w-12 mx-auto text-blue-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Standard</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Barème standard de la banque - Tous fournisseurs éligibles
            </p>
            <Badge variant="secondary">7% de base</Badge>
          </CardContent>
        </Card>

        {/* Convention */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === "convention" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onTypeSelect("convention")}
        >
          <CardContent className="pt-6 text-center p-4 md:p-6">
            <div className="mb-4">
              <Star className="h-8 w-8 md:h-12 md:w-12 mx-auto text-green-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Convention</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Convention spécifique avec fournisseurs partenaires
            </p>
            <Badge variant="outline">Barème négocié</Badge>
          </CardContent>
        </Card>

        {/* Campagne */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === "campagne" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onTypeSelect("campagne")}
        >
          <CardContent className="pt-6 text-center p-4 md:p-6">
            <div className="mb-4">
              <Zap className="h-8 w-8 md:h-12 md:w-12 mx-auto text-orange-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Campagne</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Offre promotionnelle temporaire avec taux préférentiel
            </p>
            <Badge variant="destructive">Prioritaire</Badge>
          </CardContent>
        </Card>
      </div>

      {selectedType && (
        <Button 
          onClick={onContinue}
          className="mt-6 w-full md:w-auto"
        >
          Continuer avec {selectedType === "standard" ? "Standard" : selectedType === "convention" ? "Convention" : "Campagne"}
        </Button>
      )}
    </div>
  );
};

export default LeasingTypeSelector;
