
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Convention } from "@/types/leasing";
import { Building2, Calendar, Percent } from "lucide-react";

interface ConventionSelectorProps {
  selectedConvention: Convention | null;
  onConventionSelect: (convention: Convention) => void;
}

// Données de démonstration pour les conventions
const CONVENTIONS_DISPONIBLES: Convention[] = [
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
  {
    id: "conv-btp",
    nom: "BTP & Construction",
    description: "Convention spécialisée dans les équipements de construction",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 6.8,
      marge: 3.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true
  }
];

const ConventionSelector = ({ selectedConvention, onConventionSelect }: ConventionSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sélectionner une convention</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez la convention de leasing qui correspond à votre besoin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONVENTIONS_DISPONIBLES.filter(conv => conv.actif).map((convention) => (
          <Card 
            key={convention.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedConvention?.id === convention.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onConventionSelect(convention)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Building2 className="h-5 w-5 text-green-600 mt-1" />
                <Badge variant="secondary" className="text-xs">
                  {convention.fournisseurs.length} fournisseur{convention.fournisseurs.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <CardTitle className="text-base">{convention.nom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {convention.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4 text-blue-500" />
                  <span>Taux : {convention.bareme.taux}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>
                    Jusqu'au {convention.dateFin ? 
                      convention.dateFin.toLocaleDateString('fr-FR') : 
                      'indéterminée'
                    }
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Fournisseurs :</div>
                <div className="flex flex-wrap gap-1">
                  {convention.fournisseurs.slice(0, 2).map((fournisseur) => (
                    <Badge key={fournisseur} variant="outline" className="text-xs">
                      {fournisseur}
                    </Badge>
                  ))}
                  {convention.fournisseurs.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{convention.fournisseurs.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConventionSelector;
