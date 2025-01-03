import { DataTable } from "./data-table";
import { ControlPanel } from "./control-panel";
import type { Filters, ExportFormat, AnalyticsData } from "~/types/analytics";

interface AnalyticsSectionProps {
  onFiltersChange: (filters: Filters) => void;
  isExporting: boolean;
  analyticsData?: AnalyticsData[];
}

export function AnalyticsSection({ 
  onFiltersChange, 
  isExporting,
  analyticsData = []
}: AnalyticsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Analytics by Hostname</h3>
        <p className="text-sm text-muted-foreground">
          Detailed metrics for each endpoint.
        </p>
      </div>

      <DataTable 
        data={analyticsData}
        onFiltersChange={onFiltersChange}
        isExporting={isExporting}
      />
    </div>
  );
}