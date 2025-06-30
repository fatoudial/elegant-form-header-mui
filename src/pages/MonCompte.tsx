import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { User, Bell, Shield, Globe, Save } from "lucide-react";

const MonCompte = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          
          <main className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Mon Compte</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos informations personnelles et préférences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profil */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Informations Personnelles</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input id="prenom" defaultValue="Jean" />
                      </div>
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input id="nom" defaultValue="Dupont" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="jean.dupont@creditbail.fr" />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" defaultValue="+33 1 23 45 67 89" />
                    </div>
                    <div>
                      <Label htmlFor="poste">Poste</Label>
                      <Input id="poste" defaultValue="Gestionnaire Senior" />
                    </div>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">Recevoir les alertes importantes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rappels d'échéances</p>
                        <p className="text-sm text-muted-foreground">Notifications avant les dates d'échéance</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouveaux contrats</p>
                        <p className="text-sm text-muted-foreground">Alerte lors de nouveaux contrats</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Préférences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="langue">Langue</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fuseau">Fuseau horaire</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                        <option value="europe/paris">Europe/Paris (UTC+1)</option>
                        <option value="utc">UTC</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mode sombre</p>
                        <p className="text-sm text-muted-foreground">Utiliser le thème sombre</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar droite */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Sécurité</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" className="w-full">
                      Authentification 2FA
                    </Button>
                    <Button variant="outline" className="w-full">
                      Sessions actives
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activité Récente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Connexion réussie</p>
                        <p className="text-muted-foreground">Il y a 2 heures</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="font-medium">Nouveau tiers créé</p>
                        <p className="text-muted-foreground">Hier</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="font-medium">Profil mis à jour</p>
                        <p className="text-muted-foreground">Il y a 3 jours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MonCompte;