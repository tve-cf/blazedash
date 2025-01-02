import { Filter, Settings2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ExportMenu } from "./export-menu";
import type { ExportFormat } from "~/lib/export";
import type { Column } from "~/types/analytics";

interface TableControlsProps {
  onSearch: (value: string) => void;
  searchValue: string;
  columns: Column[];
  onToggleColumn: (key: string) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  onOpenFilters: () => void;
}

export function TableControls({
  onSearch,
  searchValue,
  columns,
  onToggleColumn,
  onExport,
  isExporting,
  onOpenFilters,
}: TableControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search hostnames..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={onOpenFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <ExportMenu onExport={onExport} disabled={isExporting} />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </div>
    </div>
  );
}