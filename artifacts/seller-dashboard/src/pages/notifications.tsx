import { useGetNotifications } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ShoppingBag, AlertTriangle, CreditCard, XCircle, Star, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { data, isLoading } = useGetNotifications();

  const getIcon = (type: string) => {
    switch(type) {
      case 'new_order': return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'low_stock': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'payment_received': return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'order_cancelled': return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Restez à jour sur l'activité de votre boutique.</p>
      </div>

      <div className="max-w-3xl space-y-4">
        {isLoading ? (
          <div>Chargement...</div>
        ) : (
          data?.map((notification) => (
            <Card key={notification.id} className={cn("transition-colors", !notification.isRead && "bg-muted/30 border-primary/20")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1 bg-background rounded-full p-2 shadow-sm border border-border">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={cn("font-medium", !notification.isRead && "font-bold text-foreground")}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {data?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucune notification.</div>
        )}
      </div>
    </>
  );
}
