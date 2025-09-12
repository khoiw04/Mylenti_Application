import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationLinks } from '@/data/header';
import { cn } from "@/lib/utils";
import { HeaderState } from "@/store";

export default function Bottom() {
  const currentPath = useStore(HeaderState, (s) => s.currentPath)

    return (
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => (
              <NavigationMenuItem 
                key={index} 
                className="text-muted-foreground hover:text-primary py-1.5 font-medium">
                  <Link
                    to={link.href}
                    className={cn(
                      "hover:bg-accent py-1.5 focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1",
                      currentPath === link.href
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:text-primary font-medium"
                    )}
                  >
                    {link.label}
                  </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
    )
}