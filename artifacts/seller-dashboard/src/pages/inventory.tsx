import { useGetInventory, useUpdateInventory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Inventory() {
  const { data, isLoading } = useGetInventory();
  const updateMutation = useUpdateInventory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStockChange = async (productId: number, currentStock: number, change: number) => {
    const newStock = Math.max(0, currentStock + change);
    try {
      await updateMutation.mutateAsync({ 
        productId, 
        data: { currentStock: newStock } 
      });
      toast({ title: "Stock mis à jour", description: `Nouveau stock: ${newStock}` });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    } catch (e) {
      toast({ title: "Erreur", description: "Mise à jour impossible", variant: "destructive" });
    }
  };

  const getStatusDisplay = (status: string) => {
    if (status === 'out_of_stock') return <Badge variant="destructive">Rupture</Badge>;
    if (status === 'critical') return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1"/> Critique</Badge>;
    if (status === 'low') return <Badge variant="warning">Faible</Badge>;
    return <Badge variant="success">OK</Badge>;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Inventaire</h1>
        <p className="text-muted-foreground mt-1">Gérez vos niveaux de stock en temps réel.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-8 text-center">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead className="text-right">Stock Actuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{getStatusDisplay(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleStockChange(item.productId, item.currentStock, -1)}
                          disabled={item.currentStock <= 0}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-bold text-lg">{item.currentStock}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleStockChange(item.productId, item.currentStock, 1)}
                        >
                          <Plus className="w-3 h-3" />
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
