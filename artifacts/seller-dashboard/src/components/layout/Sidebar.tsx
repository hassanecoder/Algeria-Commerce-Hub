import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Box, 
  Bell, 
  Settings,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Produits", href: "/products", icon: Package },
  { name: "Commandes", href: "/orders", icon: ShoppingCart },
  { name: "Clients", href: "/customers", icon: Users },
  { name: "Analytiques", href: "/analytics", icon: BarChart3 },
  { name: "Inventaire", href: "/inventory", icon: Box },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden lg:flex flex-col shadow-2xl shadow-black/10">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm leading-tight text-white">Boutique Algérie</span>
            <span className="text-[10px] text-sidebar-foreground/60 font-medium">متجر الجزائر</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-none">
        <div className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/50 flex items-center justify-center text-white font-bold shadow-inner">
            AK
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Admin Kaci</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Gérant Principal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
