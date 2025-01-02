import { getDateRange } from "~/lib/date";
import type { CloudflareResponse, AnalyticsData } from "~/types/cloudflare";

const ANALYTICS_QUERY = `
  query GetZoneTopNs(
  $zoneTag: string,
  $filter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
  $pageviewsFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
  $apiFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
) {
    viewer {
        scope: zones(filter: {zoneTag: $zoneTag}) {
        total: httpRequestsAdaptiveGroups(filter: $filter, limit: 10) {
            request: count
            sum {
              dataTransferBytes: edgeResponseBytes
              visits
            __typename
            }
            dimensions {
              metric: clientRequestHTTPHost
              __typename
            }
            __typename
        }
        pageviews: httpRequestsAdaptiveGroups(limit: 5000, filter: $pageviewsFilter) {
          count
          avg {
            sampleInterval
            __typename
          }
          dimensions {
            # ts: datetimeHour
            metric: clientRequestHTTPHost
            __typename
          }
          __typename
        }
        api: httpRequestsAdaptiveGroups(limit: 5000, filter: $apiFilter) {
          count
          avg {
            sampleInterval
            __typename
          }
          sum {
            edgeResponseBytes
            __typename
          }
          dimensions {
            # ts: datetimeHour
            metric: clientRequestHTTPHost
            __typename
          }
          __typename
        }
        __typename
    }
  }
`;

async function queryGraphQL(apiToken: string, query: string, variables: any) {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    console.error('GraphQL Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  return responseData;
}

export async function getAnalytics(
  apiToken: string,
  zoneId: string,
  hostname: string
): Promise<CloudflareResponse<AnalyticsData>> {
  const { since, until } = getDateRange();

  const variables = {
    zoneTag: zoneId,
    dateGeq: since,
    dateLeq: until,
    host: hostname,
  };

  const data = await queryGraphQL(apiToken, ANALYTICS_QUERY, variables);
  
  // Transform GraphQL response to match existing schema
  const requests = data.data?.viewer?.zones?.[0]?.httpRequestsAdaptive ?? [];
  
  // If no analytics data is found, return zeros
  if (!requests || requests.length === 0) {
    return {
      success: true,
      errors: [],
      messages: [],
      result: {
        totals: {
          requests: 0,
          bytes: 0,
          threats: 0,
          cachedBytes: 0,
          cachedRequests: 0,
        },
        httpRequestsAdaptive: [],
      },
    };
  }
  
  // Calculate totals from the requests
  const cachedRequests = requests.filter((r: any) => r.cacheStatus === 'HIT').length;
  
  return {
    success: true,
    errors: [],
    messages: [],
    result: {
      totals: {
        requests: requests.length,
        bytes: 0,
        threats: requests.filter((r: any) => r.botScore < 30).length,
        cachedBytes: 0,
        cachedRequests,
      },
      httpRequestsAdaptive: requests,
    },
  };
}