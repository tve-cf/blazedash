import { Subscription } from "cloudflare/resources/shared";
import { createContext, useContext, useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { ZoneWithSubscription } from "~/types/cloudflare";

interface AnalyticsContextType {
  selectedZones: string[];
  setSelectedZones: (zones: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  zones: Array<{ label: string; value: string; subscriptions: Subscription[] }>;
  hasApiToken: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [zones, setZones] = useState<
    Array<{ label: string; value: string; subscriptions: Subscription[] }>
  >([]);
  const [hasApiToken, setHasApiToken] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("cfApiToken");
      setHasApiToken(!!token);

      const storedZones = localStorage.getItem("cfZones");
      if (storedZones) {
        try {
          const parsedZones = JSON.parse(storedZones) as ZoneWithSubscription[];
          setZones(
            parsedZones.map((zone) => ({
              label: zone.name,
              value: zone.id,
              subscriptions: zone.subscriptions,
            })),
          );
        } catch (error) {
          console.error("Error parsing zones:", error);
        }
      }
    };

    // Initial load
    handleStorageChange();

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);
    // Custom event for when we update storage from within the app
    window.addEventListener("zonesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("zonesUpdated", handleStorageChange);
    };
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        selectedZones,
        setSelectedZones,
        dateRange,
        setDateRange,
        zones,
        hasApiToken,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
