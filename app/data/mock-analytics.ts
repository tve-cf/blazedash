import type { AnalyticsData } from "~/types/analytics";

export const mockData: AnalyticsData[] = [
  {
    hostname: "api.example.com",
    requests: 1250000,
    bandwidth: "420GB",
    cacheRate: "95%",
    status: "healthy",
  },
  {
    hostname: "cdn.example.com",
    requests: 850000,
    bandwidth: "280GB",
    cacheRate: "98%",
    status: "healthy",
  },
  {
    hostname: "auth.example.com",
    requests: 180000,
    bandwidth: "85GB",
    cacheRate: "82%",
    status: "warning",
  },
  {
    hostname: "media.example.com",
    requests: 120000,
    bandwidth: "55GB",
    cacheRate: "91%",
    status: "healthy",
  },
  {
    hostname: "search.example.com",
    requests: 75000,
    bandwidth: "28GB",
    cacheRate: "76%",
    status: "error",
  },
];
