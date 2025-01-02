import type { PeriodData } from "~/types/analytics";

export const mockTrafficData: PeriodData[] = [
  {
    period: "Jan 2024",
    data: [
      {
        hostname: "hostname-1.domain.com",
        metrics: {
          requests: 100,
          pageViews: 50,
          dataTransfer: "1GB"
        }
      },
      {
        hostname: "hostname-2.domain.com",
        metrics: {
          requests: 150,
          pageViews: 50,
          dataTransfer: "1GB"
        }
      }
    ]
  },
  {
    period: "Feb 2024",
    data: [
      {
        hostname: "hostname-1.domain.com",
        metrics: {
          requests: 200,
          pageViews: 100,
          dataTransfer: "1.2GB"
        }
      },
      {
        hostname: "hostname-2.domain.com",
        metrics: {
          requests: 300,
          pageViews: 100,
          dataTransfer: "1.2GB"
        }
      }
    ]
  },
  {
    period: "Mar 2024",
    data: [
      {
        hostname: "hostname-1.domain.com",
        metrics: {
          requests: 300,
          pageViews: 200,
          dataTransfer: "1.5GB"
        }
      },
      {
        hostname: "hostname-2.domain.com",
        metrics: {
          requests: 500,
          pageViews: 200,
          dataTransfer: "1.5GB"
        }
      }
    ]
  }
];