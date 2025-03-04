import { Link, useLocation } from "@remix-run/react";
import { Activity, Shield, Zap } from "lucide-react";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "HTTP Traffic", href: "/", icon: Activity },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Performance", href: "/performance", icon: Zap },
];

export function DashboardNav() {
  const location = useLocation();

  return (
    <div className="border-b bg-background">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex space-x-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center border-b-2 px-1 py-4 text-sm font-medium",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
