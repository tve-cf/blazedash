import * as XLSX from "xlsx";
import type { AnalyticsData, Column } from "~/types/analytics";

export type ExportFormat = "csv" | "excel";

interface ExportOptions {
  data: AnalyticsData[];
  filename: string;
  format: ExportFormat;
  columns: Column[];
  getNestedValue: (obj: any, path: string) => any;
  formatValue: (value: any, key: string) => string;
}

export function exportData({
  data,
  filename,
  format,
  columns,
  getNestedValue,
  formatValue,
}: ExportOptions) {
  switch (format) {
    case "csv":
      exportToCSV({ data, filename, columns, getNestedValue, formatValue });
      break;
    case "excel":
      exportToExcel({ data, filename, columns, getNestedValue, formatValue });
      break;
  }
}

function exportToCSV({
  data,
  filename,
  columns,
  getNestedValue,
  formatValue,
}: Omit<ExportOptions, "format">) {
  const visibleColumns = columns.filter(
    (col) => col.visible && col.key !== "no",
  );
  const headers = visibleColumns.map((col) => col.label);

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      visibleColumns
        .map((col) => {
          const value = formatValue(getNestedValue(row, col.key), col.key);
          // Escape commas and quotes in the value
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  downloadFile(
    new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
    `${filename}.csv`,
  );
}

function exportToExcel({
  data,
  filename,
  columns,
  getNestedValue,
  formatValue,
}: Omit<ExportOptions, "format">) {
  const visibleColumns = columns.filter(
    (col) => col.visible && col.key !== "no",
  );

  // Transform data for Excel
  const excelData = data.map((row) => {
    const transformedRow: Record<string, any> = {};
    visibleColumns.forEach((col) => {
      transformedRow[col.label] = formatValue(
        getNestedValue(row, col.key),
        col.key,
      );
    });
    return transformedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for data
  worksheet["!cols"] = visibleColumns.map(() => ({ wch: 20 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadFile(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${filename}.xlsx`,
  );
}

function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
