import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats, useGetRevenueChart, useGetRecentOrders, useGetTopProducts, useGetWilayaSales } from "@workspace/api-client-react";
import { formatDZD, cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Package, TrendingUp, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function StatCard({ title, value, icon: Icon, trend, trendValue, subtitle }: any) {
  const isPositive = trend === "up";
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isPositive ? "text-emerald-700 bg-emerald-100" : "text-rose-700 bg-rose-100"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-display font-bold mt-1 text-foreground">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: revenueData } = useGetRevenueChart({ period: '30d' });
  const { data: recentOrders } = useGetRecentOrders();
  const { data: wilayaSales } = useGetWilayaSales();

  if (statsLoading || !stats) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue, voici un résumé de vos activités en Algérie.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenu Total" 
          value={formatDZD(stats.totalRevenue)} 
          icon={TrendingUp} 
          trend={stats.revenueGrowth >= 0 ? "up" : "down"}
          trendValue={Math.abs(stats.revenueGrowth).toFixed(1)}
        />
        <StatCard 
          title="Commandes" 
          value={stats.totalOrders.toLocaleString()} 
          icon={ShoppingCart} 
          trend={stats.ordersGrowth >= 0 ? "up" : "down"}
          trendValue={Math.abs(stats.ordersGrowth).toFixed(1)}
          subtitle={`${stats.pendingOrders} en attente`}
        />
        <StatCard 
          title="Clients" 
          value={stats.totalCustomers.toLocaleString()} 
          icon={Users} 
          trend={stats.customersGrowth >= 0 ? "up" : "down"}
          trendValue={Math.abs(stats.customersGrowth).toFixed(1)}
        />
        <StatCard 
          title="Produits" 
          value={stats.totalProducts.toLocaleString()} 
          icon={Package} 
          trend="up"
          trendValue={0}
          subtitle={`${stats.lowStockProducts} stock faible`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Aperçu des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {revenueData && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                    <YAxis tickFormatter={(val) => `${val / 1000}k`} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatDZD(value), "Revenu"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Ventes par Wilaya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-2">
              {wilayaSales?.slice(0, 5).map((w) => (
                <div key={w.wilayaCode} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground mr-3">
                    {w.wilayaCode}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{w.wilaya}</span>
                      <span className="text-sm font-bold text-primary">{w.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${w.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <MapPin className="w-3 h-3" />
                      {order.wilaya}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatDZD(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'delivered' ? 'success' : 
                      order.status === 'pending' ? 'warning' : 
                      order.status === 'cancelled' ? 'destructive' : 'default'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

