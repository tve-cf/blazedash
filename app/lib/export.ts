import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { AnalyticsData } from "~/types/analytics";

export type ExportFormat = "csv" | "excel" | "pdf";

export function exportData(data: AnalyticsData[], filename: string, format: ExportFormat) {
  switch (format) {
    case "csv":
      exportToCSV(data, filename);
      break;
    case "excel":
      exportToExcel(data, filename);
      break;
    case "pdf":
      exportToPDF(data, filename);
      break;
  }
}

function exportToCSV(data: AnalyticsData[], filename: string) {
  const headers = ["Hostname", "Requests", "Bandwidth", "Cache Rate", "Status"];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.hostname,
        row.requests,
        row.bandwidth,
        row.cacheRate,
        row.status,
      ].join(",")
    ),
  ].join("\n");

  downloadFile(
    new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), 
    `${filename}.csv`
  );
}

function exportToExcel(data: AnalyticsData[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
  
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadFile(
    new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), 
    `${filename}.xlsx`
  );
}

function exportToPDF(data: AnalyticsData[], filename: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text("Analytics Report", 14, 15);
  
  const headers = ["Hostname", "Requests", "Bandwidth", "Cache Rate", "Status"];
  const rows = data.map(item => [
    item.hostname,
    item.requests.toLocaleString(),
    item.bandwidth,
    item.cacheRate,
    item.status
  ]);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 25,
    margin: { top: 25 },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] }
  });
  
  doc.save(`${filename}.pdf`);
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