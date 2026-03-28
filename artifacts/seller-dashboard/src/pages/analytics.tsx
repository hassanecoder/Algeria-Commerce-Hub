import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSalesAnalytics, useGetCategoryAnalytics, useGetPaymentMethodAnalytics } from "@workspace/api-client-react";
import { formatDZD } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: salesData } = useGetSalesAnalytics();
  const { data: categoryData } = useGetCategoryAnalytics();
  const { data: paymentData } = useGetPaymentMethodAnalytics();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Analytiques</h1>
        <p className="text-muted-foreground mt-1">Plongez dans les détails de vos performances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Panier Moyen</p>
            <h3 className="text-2xl font-bold">{salesData ? formatDZD(salesData.averageOrderValue) : '...'}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Taux de Conversion</p>
            <h3 className="text-2xl font-bold">{salesData?.conversionRate}%</h3>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground border-transparent">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-primary-foreground/80 mb-1">Revenu (30 jours)</p>
            <h3 className="text-2xl font-bold">{salesData ? formatDZD(salesData.totalRevenue) : '...'}</h3>
            <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-0.5 rounded-full">
              +{salesData?.comparisonPrevious.growth?.toFixed(1)}% vs mois précedent
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryData && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="revenue"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatDZD(val)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Méthodes de Paiement (Algérie)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {paymentData && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(val) => `${val/1000}k`} />
                    <YAxis dataKey="label" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} formatter={(val: number) => formatDZD(val)} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
