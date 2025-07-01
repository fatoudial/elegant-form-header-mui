
export interface Convention {
  id: string;
  nom: string;
  description: string;
  fournisseurs: string[];
  prestatairesMaintenace: string[];
  categoriesMateriels: string[];
  bareme: {
    taux: number;
    marge: number;
    valeurResiduelle: number;
  };
  dateDebut: Date;
  dateFin?: Date;
  reconductionTacite: boolean;
  actif: boolean;
  statut: "active" | "expiree" | "resiliee" | "suspendue";
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

export interface ConditionBareme {
  id: string;
  nom: string;
  type: "segment" | "secteur" | "profession" | "groupe_client";
  criteres: string[];
  description?: string;
}

export interface BaremeComplet {
  id: string;
  nom: string;
  type: "standard" | "derogatoire";
  taux: number;
  marge: number;
  valeurResiduelle: number;
  typologie?: string; // "Crédit-Bail" | "LLD"
  conditions?: ConditionBareme[];
  dateCreation: Date;
  dateModification?: Date;
  actif: boolean;
}

export interface CategorieMatriel {
  id: string;
  nom: string;
  description: string;
  sousCategories?: string[];
}

// New interfaces for enhanced functionality
export interface Tiers {
  id: string;
  type: "client" | "prospect";
  nom: string;
  prenom?: string;
  raisonSociale?: string;
  adresse: string;
  telephone: string;
  email: string;
  codeClient?: string;
  segment?: string;
  secteur?: string;
  profession?: string;
  groupeClient?: string;
}

export interface Materiel {
  id: string;
  designation: string;
  categorie: string;
  prixHT: number;
  tva: number;
  fournisseur?: string;
  baremeStandard?: string;
}

export interface Proposition {
  id: string;
  numero: string;
  type: TypeProposition;
  tiers: Tiers;
  materiels: Materiel[];
  bareme: BaremeComplet;
  convention?: Convention;
  campagne?: Campagne;
  duree: number;
  apport: number;
  frequencePaiement: "mensuel" | "trimestriel" | "annuel";
  montantFinance: number;
  loyer: number;
  statut: "brouillon" | "validee" | "acceptee" | "refusee" | "annulee";
  dateCreation: Date;
  dateModification?: Date;
  dateValidation?: Date;
  validePar?: string;
}
