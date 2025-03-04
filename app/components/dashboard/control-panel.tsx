import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FilterDrawer } from "./filter-drawer";
import type { Filters } from "~/types/analytics";

const initialFilters: Filters = {
  statusCodes: [],
  cacheStatus: [],
  ipVersions: [],
  countries: [],
  clientTypes: [],
};

interface ControlPanelProps {
  onFiltersChange: (filters: Filters) => void;
}

export function ControlPanel({ onFiltersChange }: ControlPanelProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" onClick={() => setIsFilterDrawerOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />
    </div>
  );
}
