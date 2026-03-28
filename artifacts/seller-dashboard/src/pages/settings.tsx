import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Phone, Mail, MapPin } from "lucide-react";

export default function Settings() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez les informations de votre boutique.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil de la Boutique</CardTitle>
              <CardDescription>Informations visibles par vos clients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de la boutique (FR)</label>
                  <Input defaultValue="Boutique Algérie" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de la boutique (AR)</label>
                  <Input defaultValue="متجر الجزائر" dir="rtl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de contact</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" defaultValue="contact@boutique.dz" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone (Service Client)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" defaultValue="+213 555 00 11 22" />
                </div>
              </div>
              <Button className="mt-4">Enregistrer les modifications</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paiement & Livraison</CardTitle>
              <CardDescription>Configuration pour le marché algérien.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Numéro CCP</label>
                  <Input defaultValue="0012345678 90" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clé BaridiMob (RIP)</label>
                  <Input defaultValue="007 99999 0000000000 12" />
                </div>
                <Button variant="outline" className="mt-2">Mettre à jour les paiements</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center text-muted-foreground relative overflow-hidden">
                <MapPin className="w-8 h-8 opacity-50 z-10" />
                <div className="absolute inset-0 bg-[url('https://pixabay.com/get/gcf68b352ad8cc2ada2d11c82c12ab28a1c83cbe3d4e82eecbebadbc0bdac0c4b77218ce4444cfa1e620ea6d01c9311bdcf72760dd8d3d9f0acb017235ede9883_1280.jpg')] bg-cover bg-center opacity-20"></div>
                {/* map algeria placeholder */}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wilaya principale</label>
                <select className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option>16 - Alger</option>
                  <option>31 - Oran</option>
                  <option>25 - Constantine</option>
                  <option>09 - Blida</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
