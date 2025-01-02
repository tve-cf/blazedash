import { getDateRange } from "~/lib/date";
import type { CloudflareResponse, AnalyticsData } from "~/types/cloudflare";

interface AnalyticsVariables {
  zoneTags: string[];
  accountTag: string;
  filter: any;
  pageviewsFilter: any;
  apiFilter: any;
  order: string;
}

const ANALYTICS_QUERY = `query GetZoneTopNs($zoneTags:[string!],$filter:ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,$pageviewsFilter:ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,$apiFilter:ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!){viewer{scope:zones(filter:{zoneTag_in:$zoneTags}){total:httpRequestsAdaptiveGroups(filter:$filter,limit:5000){request:count sum{dataTransferBytes:edgeResponseBytes visits __typename}dimensions{metric:clientRequestHTTPHost __typename}__typename}pageviews:httpRequestsAdaptiveGroups(limit:5000,filter:$pageviewsFilter){request:count avg{sampleInterval __typename}dimensions{metric:clientRequestHTTPHost __typename}__typename}api:httpRequestsAdaptiveGroups(limit:5000,filter:$apiFilter){request:count avg{sampleInterval __typename}sum{edgeResponseBytes __typename}dimensions{metric:clientRequestHTTPHost __typename}__typename}__typename}}}`;

async function queryGraphQL<T>(apiToken: string, query: string, variables: AnalyticsVariables): Promise<T> {
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

  const responseData = await response.json<T>();

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

function groupByMetric(data: AnalyticsData) {
  const groupedObj: Record<string, any> = {};

  // Process all scopes
  data.data.viewer.scope.forEach(scope => {
    // Helper function to process each section
    const processSection = (section: any[], sectionName: string) => {
      section.forEach(item => {
        const metric = item.dimensions.metric;
        if (!groupedObj[metric]) {
          groupedObj[metric] = {
            metric: metric
          };
        }
        
        // Initialize section if it doesn't exist
        if (!groupedObj[metric][sectionName]) {
          groupedObj[metric][sectionName] = {
            requests: 0,
            dataTransferBytes: 0,
            visits: 0
          };
        }
        
        // Add values from this scope
        groupedObj[metric][sectionName].requests += item.request || 0;
        groupedObj[metric][sectionName].dataTransferBytes += item.sum?.dataTransferBytes || 0;
        groupedObj[metric][sectionName].visits += item.sum?.visits || 0;
      });
    };

    // Process each section
    if (scope.api) {
      processSection(scope.api, 'api');
    }
    if (scope.pageviews) {
      processSection(scope.pageviews, 'pageviews');
    }
    if (scope.total) {
      processSection(scope.total, 'total');
    }
  });

  // Convert object to array
  return Object.values(groupedObj);
}

export async function getAnalytics(
  apiToken: string,
  zoneIds: string[],
  since: string,
  until: string
) {
  const variables: AnalyticsVariables = {
    zoneTags: zoneIds,
    accountTag: "",
    filter: {
      AND: [
        {
          datetime_geq: since,
          datetime_leq: until
        },
        { requestSource: "eyeball" }
      ]
    },
    pageviewsFilter: {
      AND: [
        {
          datetime_geq: since,
          datetime_leq: until
        },
        { requestSource: "eyeball" },
        {
          AND: [
            {
              edgeResponseStatus: 200,
              edgeResponseContentTypeName: "html"
            }
          ]
        }
      ]
    },
    apiFilter: {
      AND: [
        { datetime_geq: since, datetime_leq: until },
        { OR: [{ edgeResponseContentTypeName: "json" }, { edgeResponseContentTypeName: "xml" }, { edgeResponseContentTypeName: "grpc" }, { edgeResponseContentTypeName: "grpcweb" }] },
        { requestSource: "eyeball" }
      ]
    },
    order: "",
  };

  const data = await queryGraphQL<AnalyticsData>(apiToken, ANALYTICS_QUERY, variables);


  // Group the data by metric
  const groupedData = groupByMetric(data);

  console.log("groupedData", groupedData);

  // Return in the correct structure matching AnalyticsData type
  return {
    success: true,
    errors: [],
    messages: [],
    result: groupedData
  };
}