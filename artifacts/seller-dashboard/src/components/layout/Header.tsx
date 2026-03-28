import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" className="-ml-2">
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-display font-bold text-lg">Boutique Algérie</span>
      </div>

      <div className="hidden lg:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher des produits, commandes (DZD)..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
        </Button>
      </div>
    </header>
  );
}
