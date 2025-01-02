import { useEffect, useState, useCallback } from "react";
import { MetaFunction, useFetcher } from "@remix-run/react";
import type { DateRange } from "react-day-picker";
import { OverviewCards } from "~/components/dashboard/overview-cards";
import type { Filters, ExportFormat, TimeUnit, ViewMode, AnalyticsData } from "~/types/analytics";
import { exportData } from "~/lib/export";
import { ComparisonControls } from "~/components/traffic/comparison-controls";
import { ComparisonTable } from "~/components/traffic/comparison-table";
import { ViewSelector } from "~/components/traffic/view-selector";
import { AnalyticsSection } from "~/components/dashboard/analytics-section";
import { SelectionRequired } from "~/components/ui/selection-required";
import { useAnalytics } from "~/context/analytics-context";
import { ComingSoonOverlay } from "~/components/ui/coming-soon-overlay";


export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Blazedash" },
    { name: "description", content: "Analytics Dashboard" },
  ];
};

type AnalyticsResponse = {
  success: boolean;
  error?: string;
  errors?: string[];
  messages?: string[];
  result: AnalyticsData[];
};

export default function Index() {
  const [isPending, setIsPending] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("day");
  const [viewMode, setViewMode] = useState<ViewMode>("general");
  const { selectedZones, dateRange, hasApiToken } = useAnalytics();
  const isSelectionComplete = selectedZones.length > 0 && dateRange?.from && dateRange?.to;
  const fetcher = useFetcher<AnalyticsResponse>();

  useEffect(() => {
    if (hasApiToken && selectedZones.length > 0 && dateRange?.from && dateRange?.to) {
      const formData = new FormData();
      const apiToken = localStorage.getItem('cfApiToken');
      
      if (!apiToken) return;

      selectedZones.forEach(zone => formData.append('zones', zone));
      formData.append('token', apiToken);
      formData.append('since', dateRange.from.toISOString());
      formData.append('until', dateRange.to.toISOString());

      fetcher.submit(formData, {
        method: 'POST',
        action: '/api/analytics'
      });
    }
  }, [selectedZones, dateRange, hasApiToken]);

  const handleFiltersChange = (filters: Filters) => {
    console.log("Filters changed:", filters);
  };

  const handleExport = (format: ExportFormat) => {
    setIsPending(true);
    try {
      exportData([], "analytics-export", format); // TODO: Use real data
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
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-medium">Traffic Analytics</h3>
          <ViewSelector mode={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === "general" ? (
          <div className="pt-4">
            {fetcher.state === 'loading' ? (
              <div>Loading analytics...</div>
            ) : fetcher.data?.error ? (
              <div className="text-destructive">
                {fetcher.data.error}
              </div>
            ) : (
              <AnalyticsSection
                analyticsData={fetcher.data?.result}
                onFiltersChange={handleFiltersChange}
                onExport={handleExport}
                isExporting={isPending}
              />
            )}
          </div>
        ) : (
          <div className="relative space-y-4">
            <ComingSoonOverlay />
            <ComparisonControls
              onTimeUnitChange={handleTimeUnitChange}
              onDateRangeChange={handleDateRangeChange}
            />

            <ComparisonTable
              data={[]} // TODO: Use real data
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