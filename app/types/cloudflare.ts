export interface CloudflareError {
  code: number;
  message: string;
}

export interface CloudflareResponse<T> {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
  result: T;
}

export interface Zone {
  id: string;
  name: string;
}

export interface DNSRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME";
  name: string;
  content: string;
}

export interface AnalyticsData {
  data: {
    viewer: {
      __typename: string;
      scope: Array<{
        api: Array<{
          __typename: string;
          avg: {
            __typename: string;
            sampleInterval: number;
          };
          count: number;
          dimensions: {
            __typename: string;
            metric: string;
          };
          sum: {
            __typename: string;
            edgeResponseBytes: number;
          };
        }>;
        pageviews: Array<{
          __typename: string;
          avg: {
            __typename: string;
            sampleInterval: number | string;
          };
          count: number;
          dimensions: {
            __typename: string;
            metric: string;
          };
        }>;
        total: Array<{
          __typename: string;
          dimensions: {
            __typename: string;
            metric: string;
          };
          request: number;
          sum: {
            __typename: string;
            dataTransferBytes: number;
            visits: number;
          };
        }>;
      }>;
    };
  };
  errors: string | null;
}