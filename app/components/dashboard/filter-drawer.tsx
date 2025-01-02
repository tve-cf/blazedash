import * as React from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import type { Filters } from "~/types/analytics";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}: FilterDrawerProps) {
  const handleStatusChange = (status: string) => {
    const newStatuses = filters.statusCodes.includes(status)
      ? filters.statusCodes.filter((s) => s !== status)
      : [...filters.statusCodes, status];
    onFiltersChange({ ...filters, statusCodes: newStatuses });
  };

  const handleCacheStatusChange = (status: string) => {
    const newStatuses = filters.cacheStatus.includes(status)
      ? filters.cacheStatus.filter((s) => s !== status)
      : [...filters.cacheStatus, status];
    onFiltersChange({ ...filters, cacheStatus: newStatuses });
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-96 transform bg-background p-6 shadow-lg transition-transform duration-200 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <h4 className="font-medium">Status Codes</h4>
          <div className="grid grid-cols-2 gap-2">
            {["2xx", "3xx", "4xx", "5xx"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.statusCodes.includes(status)}
                  onCheckedChange={() => handleStatusChange(status)}
                />
                <Label htmlFor={`status-${status}`}>{status}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Cache Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {["HIT", "MISS", "BYPASS"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`cache-${status}`}
                  checked={filters.cacheStatus.includes(status)}
                  onCheckedChange={() => handleCacheStatusChange(status)}
                />
                <Label htmlFor={`cache-${status}`}>{status}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">IP Version</h4>
          <div className="grid grid-cols-2 gap-2">
            {["IPv4", "IPv6"].map((version) => (
              <div key={version} className="flex items-center space-x-2">
                <Checkbox
                  id={`ip-${version}`}
                  checked={filters.ipVersions.includes(version)}
                  onCheckedChange={() => {
                    const newVersions = filters.ipVersions.includes(version)
                      ? filters.ipVersions.filter((v) => v !== version)
                      : [...filters.ipVersions, version];
                    onFiltersChange({ ...filters, ipVersions: newVersions });
                  }}
                />
                <Label htmlFor={`ip-${version}`}>{version}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button onClick={onClose}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}