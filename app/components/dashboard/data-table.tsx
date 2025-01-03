import { useState, useTransition } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TableControls } from "./table-controls";
import { FilterDrawer } from "./filter-drawer";
import { exportData, type ExportFormat } from "~/lib/export";
import type { AnalyticsData, Column, Filters } from "~/types/analytics";
import { useAnalytics } from "~/context/analytics-context";

const initialColumns: Column[] = [
  { key: "no", label: "No.", visible: true },
  { key: "metric", label: "Hostname", visible: true },
  { 
    key: "total.requests", 
    label: "Total Requests", 
    visible: true 
  },
  { 
    key: "total.dataTransferBytes", 
    label: "Total Bandwidth", 
    visible: true 
  },
  { 
    key: "total.visits", 
    label: "Total Visits", 
    visible: true 
  },
  { 
    key: "api.requests", 
    label: "API Requests", 
    visible: true 
  },
  { 
    key: "pageviews.requests", 
    label: "Page Views", 
    visible: true 
  }
];

interface DataTableProps {
  data: AnalyticsData[];
  onFiltersChange: (filters: Filters) => void;
  onExport?: (format: ExportFormat) => void;
  isExporting: boolean;
}

const initialFilters: Filters = {
  statusCodes: [],
  cacheStatus: [],
  ipVersions: [],
  countries: [],
  clientTypes: [],
};

export function DataTable({ data, onFiltersChange, onExport, isExporting }: DataTableProps) {
  const { selectedZones, dateRange } = useAnalytics();
  const [sortField, setSortField] = useState<string>("total.requests");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const itemsPerPage = 1000;

  const visibleColumns = columns.filter((col) => col.visible);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? 0;
  };

  const formatValue = (value: any, key: string) => {
    if (value === undefined || value === null) {
      return '-';
    }
    if (key.includes('dataTransferBytes')) {
      // Convert bytes to MB, GB, or TB
      const mb = value / (1000 * 1000);
      if (mb >= 1000000) {
        const tb = mb / 1000000;
        return `${tb.toFixed(2)} TB`;
      }
      if (mb >= 1000) {
        const gb = mb / 1000;
        return `${gb.toFixed(2)} GB`;
      }
      return `${mb.toFixed(2)} MB`;
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const filteredData = data
    .filter((item) =>
      item.metric.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate subtotals for numeric columns
  const subtotals = visibleColumns.reduce((acc, column) => {
    if (column.key === 'metric') {
      acc[column.key] = 'Subtotal';
    } else {
      acc[column.key] = filteredData.reduce((sum, item) => {
        const value = getNestedValue(item, column.key);
        return typeof value === 'number' ? sum + value : sum;
      }, 0);
    }
    return acc;
  }, {} as Record<string, any>);

  const toggleColumn = (key: string) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  const handleExport = (format: ExportFormat) => {
    if (onExport) {
      onExport(format);
      return;
    }

    exportData({
      data: filteredData,
      filename: "analytics-export",
      format,
      columns: visibleColumns,
      getNestedValue,
      formatValue
    });
  };

  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <TableControls
        onSearch={setSearch}
        searchValue={search}
        columns={columns.filter(col => col.key !== 'no')}
        onToggleColumn={toggleColumn}
        onExport={handleExport}
        isExporting={isExporting}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
      />

      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`rounded-lg border bg-background ${isPending ? "opacity-70" : ""}`}>
        <table className="w-full">
          <thead className="[&_tr]:border-b bg-primary/5">
            <tr className="border-b transition-colors hover:bg-primary/10 data-[state=selected]:bg-primary/20 text-left">
              {visibleColumns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.key === 'no' ? (
                    <span className="text-sm font-semibold">{column.label}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center text-sm font-semibold hover:text-primary transition-colors duration-200"
                    >
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.metric} className="border-b">
                {visibleColumns.map((column) => (
                  <td key={`${item.metric}-${column.key}`} className="py-3 px-4">
                    {column.key === 'no' 
                      ? startIndex + index + 1
                      : formatValue(getNestedValue(item, column.key), column.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 font-medium bg-muted/50">
              {visibleColumns.map((column) => (
                <td key={`subtotal-${column.key}`} className="py-3 px-4">
                  {column.key === 'no' 
                    ? ''
                    : formatValue(subtotals[column.key], column.key)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}