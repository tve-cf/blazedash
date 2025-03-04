export interface AnalyticsMetric {
  requests: number;
  dataTransferBytes: number;
  visits?: number;
}

export interface AnalyticsData {
  metric: string;
  total?: AnalyticsMetric;
  api?: AnalyticsMetric;
  pageviews?: AnalyticsMetric;
}

export interface Column {
  key: string;
  label: string;
  visible: boolean;
  tooltip?: string;
}

export interface Filters {
  statusCodes: string[];
  cacheStatus: string[];
  ipVersions: string[];
  countries: string[];
  clientTypes: string[];
  includeBotManagement?: boolean;
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