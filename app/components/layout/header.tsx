import { Link, useLocation } from "@remix-run/react";
import { Settings, Sun, Moon } from "lucide-react";
import { ZoneSelect } from "~/components/ui/zone-select";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import { useAnalytics } from "~/context/analytics-context";
import { ThemeSwitcher } from "~/components/ui/theme-switcher";
import { Button } from "../ui/button";
import type { DateRange } from "react-day-picker";

const zones = [
  { label: "api.example.com", value: "api" },
  { label: "cdn.example.com", value: "cdn" },
  { label: "auth.example.com", value: "auth" },
  { label: "media.example.com", value: "media" },
];

export function Header() {
  const { selectedZones, setSelectedZones, dateRange, setDateRange } = useAnalytics();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold hover:text-primary">
            Blazedash
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ZoneSelect
            placeholder="Select zones..."
            options={zones}
            selected={selectedZones || []}
            onChange={(values) => setSelectedZones(values)}
            className="w-[250px]"
          />
          <DateRangePicker 
            className="w-[300px]"
            onChange={(range) => setDateRange(range)}
          />
          <ThemeSwitcher />
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}