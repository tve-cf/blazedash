import { DataTable } from "./data-table";
import { ControlPanel } from "./control-panel";
import type { Filters, ExportFormat, AnalyticsData } from "~/types/analytics";

interface AnalyticsSectionProps {
  onFiltersChange: (filters: Filters) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  analyticsData?: AnalyticsData[];
}

export function AnalyticsSection({ 
  onFiltersChange, 
  onExport,
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
        onExport={onExport}
        isExporting={isExporting}
      />
    </div>
  );
}