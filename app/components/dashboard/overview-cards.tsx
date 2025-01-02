import { Activity, ArrowUpDown, Database, Zap } from "lucide-react";
import { StatCard } from "./stat-card";

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Requests"
        value="2.4M"
        description="Total API requests this month"
        icon={Activity}
        trend="up"
        trendValue="12% from last month"
      />
      <StatCard
        title="Bandwidth"
        value="840GB"
        description="Total bandwidth consumed"
        icon={ArrowUpDown}
        trend="up"
        trendValue="8% from last month"
      />
      <StatCard
        title="Cache Hit Rate"
        value="94.2%"
        description="Average cache performance"
        icon={Zap}
        trend="up"
        trendValue="3% from last month"
      />
      <StatCard
        title="Database Load"
        value="42%"
        description="Average database utilization"
        icon={Database}
        trend="down"
        trendValue="5% from last month"
      />
    </div>
  );
}