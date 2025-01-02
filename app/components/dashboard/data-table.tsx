import { useState, useTransition } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TableControls } from "./table-controls";
import { FilterDrawer } from "./filter-drawer";
import { exportData, type ExportFormat } from "~/lib/export";
import type { AnalyticsData, Column, Filters } from "~/types/analytics";
import { mockData } from "~/data/mock-analytics";

const initialColumns: Column[] = [
  { key: "hostname", label: "Hostname", visible: true },
  { key: "requests", label: "Requests", visible: true },
  { key: "bandwidth", label: "Bandwidth", visible: true },
  { key: "cacheRate", label: "Cache Rate", visible: true },
  { key: "status", label: "Status", visible: true },
];


interface DataTableProps {
  onFiltersChange: (filters: Filters) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
}

const initialFilters: Filters = {
  statusCodes: [],
  cacheStatus: [],
  ipVersions: [],
  countries: [],
  clientTypes: [],
};

export function DataTable({ onFiltersChange, onExport, isExporting }: DataTableProps) {
  const [sortField, setSortField] = useState<keyof AnalyticsData>("requests");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const itemsPerPage = 4;

  const visibleColumns = columns.filter((col) => col.visible);

  const handleSort = (field: keyof AnalyticsData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredData = mockData
    .filter((item) =>
      item.hostname.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const toggleColumn = (key: keyof AnalyticsData) => {
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

  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <TableControls
        onSearch={setSearch}
        searchValue={search}
        columns={columns}
        onToggleColumn={toggleColumn}
        onExport={onExport}
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
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center text-sm font-semibold hover:text-primary transition-colors duration-200"
                  >
                    {column.label}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.hostname} className="border-b">
                {visibleColumns.map((column) => (
                  <td key={`${item.hostname}-${column.key}`} className="py-3 px-4">
                    {column.key === "status" ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.status === "healthy"
                            ? "bg-green-50 text-green-700"
                            : item.status === "warning"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : column.key === "requests" ? (
                      item[column.key].toLocaleString()
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}