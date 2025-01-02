import { createContext, useContext, useState } from "react";
import type { DateRange } from "react-day-picker";

interface AnalyticsContextType {
  selectedZones: string[];
  setSelectedZones: (zones: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <AnalyticsContext.Provider
      value={{
        selectedZones,
        setSelectedZones,
        dateRange,
        setDateRange,
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