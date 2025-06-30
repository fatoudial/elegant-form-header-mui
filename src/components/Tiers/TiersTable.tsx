import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Eye } from "lucide-react";

interface Tiers {
  id: string;
  nom: string;
  type: "Physique" | "Morale";
  roles: string[];
  statut: "Actif" | "Inactif" | "Suspendu";
  nif?: string;
  dateCreation: string;
  risque: "Faible" | "Moyen" | "Élevé";
}

const mockTiers: Tiers[] = [
  {
    id: "T001",
    nom: "SARL Technologies Plus",
    type: "Morale",
    roles: ["Client", "Locataire"],
    statut: "Actif",
    nif: "123456789",
    dateCreation: "2024-01-15",
    risque: "Faible"
  },
  {
    id: "T002", 
    nom: "Martin Dupont",
    type: "Physique",
    roles: ["Garant"],
    statut: "Actif",
    dateCreation: "2024-02-10",
    risque: "Moyen"
  },
  {
    id: "T003",
    nom: "Équipements Industriels SA",
    type: "Morale", 
    roles: ["Fournisseur"],
    statut: "Actif",
    nif: "987654321",
    dateCreation: "2024-01-20",
    risque: "Faible"
  }
];

const TiersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTiers, setFilteredTiers] = useState(mockTiers);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockTiers.filter(tiers =>
      tiers.nom.toLowerCase().includes(value.toLowerCase()) ||
      tiers.nif?.includes(value) ||
      tiers.roles.some(role => role.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredTiers(filtered);
  };

  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "Actif": return "default";
      case "Inactif": return "secondary";
      case "Suspendu": return "destructive";
      default: return "secondary";
    }
  };

  const getRiskBadgeVariant = (risque: string) => {
    switch (risque) {
      case "Faible": return "default";
      case "Moyen": return "secondary";
      case "Élevé": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestion des Tiers</CardTitle>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau Tiers</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, NIF ou rôle..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom/Raison Sociale</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rôles</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>Risque</TableHead>
              <TableHead>Date Création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTiers.map((tiers) => (
              <TableRow key={tiers.id}>
                <TableCell className="font-mono">{tiers.id}</TableCell>
                <TableCell className="font-medium">{tiers.nom}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tiers.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tiers.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(tiers.statut)}>
                    {tiers.statut}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{tiers.nif || "-"}</TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(tiers.risque)}>
                    {tiers.risque}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(tiers.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TiersTable;