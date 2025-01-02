import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useCallback, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { OverviewCards } from "~/components/dashboard/overview-cards";
import type { Filters, ExportFormat, TimeUnit, MetricComparison, ViewMode } from "~/types/analytics";
import { mockData } from "~/data/mock-analytics";
import { exportData } from "~/lib/export";
import { ComparisonControls } from "~/components/traffic/comparison-controls";
import { ComparisonTable } from "~/components/traffic/comparison-table";
import { ViewSelector } from "~/components/traffic/view-selector";
import { AnalyticsSection } from "~/components/dashboard/analytics-section";
import { SelectionRequired } from "~/components/ui/selection-required";
import { useAnalytics } from "~/context/analytics-context";
import { ComingSoonOverlay } from "~/components/ui/coming-soon-overlay";
import { mockTrafficData } from "~/data/mock-traffic";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Blazedash" },
    { name: "description", content: "Analytics Dashboard" },
  ];
};

const mockComparisonData: MetricComparison[] = [
  {
    metric: "Total Requests",
    values: {
      "Current Period": "2.4M",
      "Previous Period": "2.1M"
    },
    change: 14.3
  },
  {
    metric: "Unique Visitors",
    values: {
      "Current Period": "850K",
      "Previous Period": "720K"
    },
    change: 18.1
  },
  {
    metric: "Bandwidth Used",
    values: {
      "Current Period": "840GB",
      "Previous Period": "780GB"
    },
    change: 7.7
  },
  {
    metric: "Cache Hit Rate",
    values: {
      "Current Period": "94.2%",
      "Previous Period": "91.5%"
    },
    change: 2.7
  }
];

const periods = ["Current Period", "Previous Period"];

export default function Index() {
  const [isPending, setIsPending] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("day");
  const [viewMode, setViewMode] = useState<ViewMode>("general");
  const { selectedZones, dateRange } = useAnalytics();
  const isSelectionComplete = selectedZones.length > 0;

  const handleFiltersChange = (filters: Filters) => {
    console.log("Filters changed:", filters);
  };

  const handleExport = (format: ExportFormat) => {
    setIsPending(true);
    try {
      exportData(mockData, "analytics-export", format);
    } finally {
      setIsPending(false);
    }
  };

  const handleTimeUnitChange = useCallback((unit: TimeUnit) => {
    setTimeUnit(unit);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    console.log("Date range changed:", range);
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative">
      <div className="border-b pb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your analytics overview and key metrics.
          </p>
        </div>
      </div>
      
      <OverviewCards />

      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-medium">Traffic Analytics</h3>
        <ViewSelector mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "general" ? (
        <AnalyticsSection
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          isExporting={isPending}
        />
      ) : (
        <div className="relative space-y-6">
          <ComingSoonOverlay />
          <ComparisonControls
            onTimeUnitChange={handleTimeUnitChange}
            onDateRangeChange={handleDateRangeChange}
            // timeUnit={timeUnit}
          />
          
          <ComparisonTable 
            data={mockTrafficData}
            timeUnit={timeUnit}
          />
        </div>
      )}
      {!isSelectionComplete && (
        <SelectionRequired 
          message="Please select at least one zone to view analytics data."
        />
      )}
      </div>
    </div>
  );
}