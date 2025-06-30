
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Edit, FileText } from "lucide-react";

// Données de test
const mockPropositions = [
  {
    id: "PROP-2024-001",
    client: "SARL Martin & Associés",
    commercial: "Sophie Dubois",
    montant: 125000,
    statut: "En attente d'avis",
    dateCreation: "15/01/2024",
    objetFinance: "Matériel industriel",
  },
  {
    id: "PROP-2024-002", 
    client: "SAS TechnoPlus",
    commercial: "Pierre Laurent",
    montant: 85000,
    statut: "Validée",
    dateCreation: "12/01/2024",
    objetFinance: "Véhicules utilitaires",
  },
  {
    id: "PROP-2024-003",
    client: "EURL BatiCorp",
    commercial: "Marie Rousseau",
    montant: 200000,
    statut: "Brouillon",
    dateCreation: "10/01/2024",
    objetFinance: "Équipement BTP",
  },
];

interface PropositionsTableProps {
  onViewProposition?: (propositionId: string) => void;
}

const PropositionsTable = ({ onViewProposition }: PropositionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Brouillon":
        return "bg-gray-100 text-gray-800";
      case "En attente d'avis":
        return "bg-yellow-100 text-yellow-800";
      case "Validée":
        return "bg-green-100 text-green-800";
      case "Refusée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredPropositions = mockPropositions.filter(prop => {
    const matchesSearch = prop.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || prop.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filtres de recherche */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par client ou numéro de proposition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="Brouillon">Brouillon</SelectItem>
            <SelectItem value="En attente d'avis">En attente d'avis</SelectItem>
            <SelectItem value="Validée">Validée</SelectItem>
            <SelectItem value="Refusée">Refusée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau des propositions */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Proposition</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Objet financé</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPropositions.map((proposition) => (
              <TableRow key={proposition.id}>
                <TableCell className="font-medium">{proposition.id}</TableCell>
                <TableCell>{proposition.client}</TableCell>
                <TableCell>{proposition.commercial}</TableCell>
                <TableCell>{proposition.objetFinance}</TableCell>
                <TableCell>{proposition.montant.toLocaleString("fr-FR")} €</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(proposition.statut)}>
                    {proposition.statut}
                  </Badge>
                </TableCell>
                <TableCell>{proposition.dateCreation}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewProposition?.(proposition.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropositionsTable;
