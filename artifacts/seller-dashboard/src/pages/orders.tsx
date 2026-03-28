import { useState } from "react";
import { useGetOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDZD, formatDate } from "@/lib/utils";
import { Search, MapPin, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Orders() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetOrders({ search });
  const updateStatus = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleMarkDelivered = async (id: number) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: "delivered" } });
      toast({ title: "Succès", description: "Commande marquée comme livrée." });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    } catch (e) {
      toast({ title: "Erreur", description: "Échec de la mise à jour.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, any> = {
      pending: { label: "En attente", variant: "warning" },
      confirmed: { label: "Confirmée", variant: "default" },
      processing: { label: "En traitement", variant: "secondary" },
      shipped: { label: "Expédiée", variant: "default" },
      delivered: { label: "Livrée", variant: "success" },
      cancelled: { label: "Annulée", variant: "destructive" },
      returned: { label: "Retournée", variant: "destructive" },
    };
    const mapped = map[status] || { label: status, variant: "outline" };
    return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Commandes (الطلبيات)</h1>
        <p className="text-muted-foreground mt-1">Suivez et gérez vos expéditions à travers l'Algérie.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="N° Commande, Client..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Lieu de livraison</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary">#{order.orderNumber}</TableCell>
                    <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {order.wilaya}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">{formatDZD(order.totalAmount)}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleMarkDelivered(order.id)}
                            title="Marquer livrée"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
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
