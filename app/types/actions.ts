import type { Zone, DNSRecord, AnalyticsData } from "./cloudflare";

interface SuccessResponse {
  success: true;
  zones?: Zone[];
  records?: DNSRecord[];
  analytics?: AnalyticsData;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export type ActionData = SuccessResponse | ErrorResponse;
