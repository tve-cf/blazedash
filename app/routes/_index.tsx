import { useEffect, useState, useCallback } from "react";
import { MetaFunction, useFetcher } from "@remix-run/react";
import type { DateRange } from "react-day-picker";
import type {
  Filters,
  TimeUnit,
  ViewMode,
  AnalyticsData,
} from "~/types/analytics";
import { ComparisonControls } from "~/components/traffic/comparison-controls";
import { ComparisonTable } from "~/components/traffic/comparison-table";
import { ViewSelector } from "~/components/traffic/view-selector";
import { AnalyticsSection } from "~/components/dashboard/analytics-section";
import { SelectionRequired } from "~/components/ui/selection-required";
import { useAnalytics } from "~/context/analytics-context";
import { ComingSoonOverlay } from "~/components/ui/coming-soon-overlay";
import { Loader2 } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

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
  const [includeBotManagement, setIncludeBotManagement] = useState(false);
  const [botManagemetError, setBotManagemetError] = useState(false);
  const { selectedZones, dateRange, hasApiToken, zones } = useAnalytics();
  const isSelectionComplete =
    selectedZones.length > 0 && dateRange?.from && dateRange?.to;
  const fetcher = useFetcher<AnalyticsResponse>();

  useEffect(() => {
    if (
      hasApiToken &&
      selectedZones.length > 0 &&
      dateRange?.from &&
      dateRange?.to
    ) {
      const formData = new FormData();
      const apiToken = localStorage.getItem("cfApiToken");

      if (!apiToken) return;

      selectedZones.forEach((zone) => formData.append("zones", zone));
      formData.append("token", apiToken);

      // Set hours, minutes and seconds to start of day in local time
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      formData.append("since", fromDate.toISOString());

      // Set hours, minutes and seconds to end of day in local time
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      formData.append("until", toDate.toISOString());

      // Add bot management parameter
      if (includeBotManagement) {
        formData.append("includeBotManagement", "true");
      }

      fetcher.submit(formData, {
        method: "POST",
        action: "/api/analytics",
      });
    }
  }, [selectedZones, dateRange, hasApiToken, includeBotManagement]);

  const handleFiltersChange = (filters: Filters) => {
    console.log("Filters changed:", filters);
  };

  const handleBotManagementChange = (include: boolean) => {
    if (!include) {
      setIncludeBotManagement(false);
      setBotManagemetError(false);
      return include;
    }

    // Check if any selected zone has Bot Management subscription
    const hasBotManagement = selectedZones.every((zoneId) => {
      const zone = zones.find((z) => z.value === zoneId);
      if (!zone) return false;

      return zone.subscriptions?.some((sub) => {
        const planId = sub.rate_plan?.id as string;
        return planId === "bot_zone_ent";
      });
    });

    if (!hasBotManagement && include) {
      setBotManagemetError(true);
      return;
    }

    setIncludeBotManagement(include);
    setBotManagemetError(false);
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
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="bot-management"
                checked={includeBotManagement}
                onCheckedChange={handleBotManagementChange}
              />
              <Label htmlFor="bot-management">Include Bot Traffic</Label>
            </div>
            <ViewSelector mode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {viewMode === "general" ? (
          <div className="pt-4">
            {botManagemetError && (
              <div className="text-destructive flex space-x-4 items-center justify-center w-full">
                <div className="text-center">
                  <p>All zones selected must include bot management.</p>
                </div>
              </div>
            )}
            {fetcher.state === "submitting" ? (
              <div className="animate-pulse flex space-x-4 items-center justify-center w-full">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <div className="text-muted-foreground">
                  Loading analytics...
                </div>
              </div>
            ) : fetcher.data?.error ? (
              <div className="text-destructive flex space-x-4 items-center justify-center w-full">
                <div className="text-center">
                  <p>
                    Please select a shorter date range to view analytics data.
                  </p>
                  <p>
                    There will be limits on the number of zones and date range
                    you can select based on your Cloudflare plan.
                  </p>
                </div>
              </div>
            ) : (
              <AnalyticsSection
                analyticsData={fetcher.data?.result}
                onFiltersChange={handleFiltersChange}
                isExporting={isPending}
                includeBotManagement={includeBotManagement}
                onBotManagementChange={handleBotManagementChange}
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
          <SelectionRequired message="Please select at least one zone and set the date range to view analytics data." />
        )}
      </div>
    </div>
  );
}
