import { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {trend && trendValue && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={cn(
              "mr-1",
              trend === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {trend === "up" ? "↑" : "↓"}
          </span>
          <span
            className={cn(
              "font-medium",
              trend === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}