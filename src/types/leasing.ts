
export interface Convention {
  id: string;
  nom: string;
  description: string;
  fournisseurs: string[];
  bareme: {
    taux: number;
    marge: number;
    valeurResiduelle: number;
  };
  dateDebut: Date;
  dateFin?: Date;
  actif: boolean;
}

export interface Campagne {
  id: string;
  nom: string;
  description: string;
  type: "fournisseur" | "banque";
  fournisseurs?: string[];
  bareme: {
    taux: number;
    marge: number;
    valeurResiduelle: number;
  };
  dateDebut: Date;
  dateFin: Date;
  actif: boolean;
  prioritaire: boolean;
}

export type TypeProposition = "standard" | "convention" | "campagne";

export interface BaremeStandard {
  taux: number;
  marge: number;
  valeurResiduelle: number;
}
