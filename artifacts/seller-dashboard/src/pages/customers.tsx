import { useGetCustomers } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDZD, formatDate } from "@/lib/utils";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Customers() {
  const { data, isLoading } = useGetCustomers();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-1">Base de données clients et historique.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-8 text-center">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Total Dépensé</TableHead>
                  <TableHead>Dernière activité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {customer.name.substring(0, 2)}
                        </div>
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" /> {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" /> {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {customer.wilaya} {customer.commune ? `- ${customer.commune}` : ''}
                        </div>
                    </TableCell>
                    <TableCell className="font-semibold text-center">{customer.totalOrders}</TableCell>
                    <TableCell className="font-bold text-primary">{formatDZD(customer.totalSpent)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(customer.lastOrderAt || customer.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
