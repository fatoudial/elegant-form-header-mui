import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, CreditCard, Users, Shield, Star, FileText, CheckCircle } from "lucide-react";

const TiersForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    // Étape 1 - Informations personnelles
    titre: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    paysNaissance: "",
    villeNaissance: "",
    
    // Étape 2 - Documents et identification
    typePiece: "",
    numeroPiece: "",
    dateExpirationPiece: "",
    paysImmatriculation: "",
    nif: "",
    
    // Étape 3 - Informations professionnelles
    typeTiers: "Physique",
    roles: [] as string[],
    activitePrincipale: "",
    raisonSociale: "",
    formeJuridique: "",
    numeroRegistreCommerce: "",
    capitalSocial: "",
    dateCreationSociete: "",
  });

  const availableRoles = ["Client", "Fournisseur", "Garant", "Assureur", "Locataire"];

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, roles: [...prev.roles, role] }));
    } else {
      setFormData(prev => ({ ...prev, roles: prev.roles.filter(r => r !== role) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Création d'un Nouveau Tiers</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="identite" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="identite" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Identité</span>
          </TabsTrigger>
          <TabsTrigger value="adresses" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Adresses</span>
          </TabsTrigger>
          <TabsTrigger value="comptes" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Comptes</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="notation" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Notation</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identite">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informations d'Identité</span>
                <span className="text-sm text-muted-foreground">Étape {currentStep} sur {totalSteps}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Informations Personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="titre">Titre</Label>
                      <Select value={formData.titre} onValueChange={(value) => setFormData(prev => ({ ...prev, titre: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un titre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Monsieur</SelectItem>
                          <SelectItem value="Mme">Madame</SelectItem>
                          <SelectItem value="Mlle">Mademoiselle</SelectItem>
                          <SelectItem value="Dr">Docteur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input id="nom" value={formData.nom} onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input id="prenom" value={formData.prenom} onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance">Date de Naissance *</Label>
                      <Input type="date" id="dateNaissance" value={formData.dateNaissance} onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paysNaissance">Pays de Naissance</Label>
                      <Select value={formData.paysNaissance} onValueChange={(value) => setFormData(prev => ({ ...prev, paysNaissance: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TN">Tunisie</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="MA">Maroc</SelectItem>
                          <SelectItem value="DZ">Algérie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="villeNaissance">Ville de Naissance</Label>
                      <Input id="villeNaissance" value={formData.villeNaissance} onChange={(e) => setFormData(prev => ({ ...prev, villeNaissance: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Documents et Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="typePiece">Type de Pièce *</Label>
                      <Select value={formData.typePiece} onValueChange={(value) => setFormData(prev => ({ ...prev, typePiece: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type de pièce" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CIN">Carte d'Identité Nationale</SelectItem>
                          <SelectItem value="Passeport">Passeport</SelectItem>
                          <SelectItem value="Permis">Permis de Conduire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroPiece">Numéro de Pièce *</Label>
                      <Input id="numeroPiece" value={formData.numeroPiece} onChange={(e) => setFormData(prev => ({ ...prev, numeroPiece: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateExpirationPiece">Date d'Expiration de Pièce</Label>
                      <Input type="date" id="dateExpirationPiece" value={formData.dateExpirationPiece} onChange={(e) => setFormData(prev => ({ ...prev, dateExpirationPiece: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paysImmatriculation">Pays d'Immatriculation</Label>
                      <Select value={formData.paysImmatriculation} onValueChange={(value) => setFormData(prev => ({ ...prev, paysImmatriculation: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TN">Tunisie</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="MA">Maroc</SelectItem>
                          <SelectItem value="DZ">Algérie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nif">NIF *</Label>
                      <Input id="nif" value={formData.nif} onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Informations Professionnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="typeTiers">Type de Tiers *</Label>
                      <Select value={formData.typeTiers} onValueChange={(value) => setFormData(prev => ({ ...prev, typeTiers: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Physique">Personne Physique</SelectItem>
                          <SelectItem value="Morale">Personne Morale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activitePrincipale">Activité Principale</Label>
                      <Input id="activitePrincipale" value={formData.activitePrincipale} onChange={(e) => setFormData(prev => ({ ...prev, activitePrincipale: e.target.value }))} />
                    </div>
                    
                    {formData.typeTiers === "Morale" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="raisonSociale">Raison Sociale *</Label>
                          <Input id="raisonSociale" value={formData.raisonSociale} onChange={(e) => setFormData(prev => ({ ...prev, raisonSociale: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formeJuridique">Forme Juridique</Label>
                          <Select value={formData.formeJuridique} onValueChange={(value) => setFormData(prev => ({ ...prev, formeJuridique: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la forme juridique" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SARL">SARL</SelectItem>
                              <SelectItem value="SA">SA</SelectItem>
                              <SelectItem value="SUARL">SUARL</SelectItem>
                              <SelectItem value="SNC">SNC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numeroRegistreCommerce">Numéro de Registre du Commerce</Label>
                          <Input id="numeroRegistreCommerce" value={formData.numeroRegistreCommerce} onChange={(e) => setFormData(prev => ({ ...prev, numeroRegistreCommerce: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="capitalSocial">Capital Social</Label>
                          <Input id="capitalSocial" value={formData.capitalSocial} onChange={(e) => setFormData(prev => ({ ...prev, capitalSocial: e.target.value }))} placeholder="En dinars" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateCreationSociete">Date de Création de la Société</Label>
                          <Input type="date" id="dateCreationSociete" value={formData.dateCreationSociete} onChange={(e) => setFormData(prev => ({ ...prev, dateCreationSociete: e.target.value }))} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Rôle du Tiers *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={formData.roles.includes(role)}
                            onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                          />
                          <Label htmlFor={role} className="text-sm font-normal">
                            {role}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                  disabled={currentStep === totalSteps}
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adresses">
          <Card>
            <CardHeader>
              <CardTitle>Adresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse de facturation *</Label>
                  <Textarea id="adresse" placeholder="Adresse complète..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Input id="ville" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code Postal *</Label>
                  <Input id="codePostal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TN">Tunisie</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="MA">Maroc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comptes">
          <Card>
            <CardHeader>
              <CardTitle>Comptes Bancaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN *</Label>
                  <Input id="iban" placeholder="TN59 0000 0000 0000 0000 0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bic">BIC/SWIFT</Label>
                  <Input id="bic" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banque">Banque</Label>
                  <Input id="banque" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agence">Agence</Label>
                  <Input id="agence" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input type="email" id="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input id="telephone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">Fax</Label>
                  <Input id="fax" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notation">
          <Card>
            <CardHeader>
              <CardTitle>Notation et Risque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="risque">Niveau de Risque</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau de risque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Faible">Faible</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                      <SelectItem value="Élevé">Élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notation">Notation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la notation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AAA">AAA</SelectItem>
                      <SelectItem value="AA">AA</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="BBB">BBB</SelectItem>
                      <SelectItem value="BB">BB</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea id="commentaires" placeholder="Notes sur l'évaluation du risque..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents Requis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-dashed border-border rounded-lg text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cliquer pour ajouter des documents</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Documents requis selon le type :</Label>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Pièce d'identité (CIN/Passeport)</li>
                  <li>Justificatif de domicile</li>
                  <li>Statuts de la société (si personne morale)</li>
                  <li>Extrait RNE</li>
                  <li>Attestation fiscale</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Annuler</Button>
        <Button>
          <CheckCircle className="h-4 w-4 mr-2" />
          Enregistrer le Tiers
        </Button>
      </div>
    </div>
  );
};

export default TiersForm;