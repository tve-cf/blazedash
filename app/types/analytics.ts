export interface AnalyticsData {
  hostname: string;
  requests: number;
  bandwidth: string;
  cacheRate: string;
  status: "healthy" | "warning" | "error";
}

export interface Column {
  key: keyof AnalyticsData;
  label: string;
  visible: boolean;
}

export interface Filters {
  statusCodes: string[];
  cacheStatus: string[];
  ipVersions: string[];
  countries: string[];
  clientTypes: string[];
}

export interface TrafficData {
  hostname: string;
  metrics: {
    requests: number;
    pageViews: number;
    dataTransfer: string;
  };
}

export interface PeriodData {
  period: string;
  data: TrafficData[];
}

export type ExportFormat = "csv" | "excel" | "pdf";
export type TimeUnit = "day" | "week" | "month";
export type ViewMode = "general" | "comparison";

export interface MetricComparison {
  metric: string;
  values: Record<string, string | number>;
  change: number;
}