import { getDateRange } from "~/lib/date";
import type { CloudflareResponse, AnalyticsData } from "~/types/cloudflare";
import { queryGraphQL } from "./base";
import { gql, request } from "graphql-request";

interface AnalyticsVariables {
  zoneTags: string[];
  accountTag: string;
  filter: any;
  pageviewsFilter: any;
  apiFilter: any;
  order: string;
  botTotalFilter: any;
  likelyHumanFilter: any;
}

const analyticsQuery = (includeBotManagement: boolean = false) => {
  return gql`
  query GetZoneTopNs(
    $zoneTags: [string!]
    $filter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
    $pageviewsFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
    $apiFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
    $botTotalFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject
  ) {
    viewer {
      scope: zones(filter: { zoneTag_in: $zoneTags }) {
        total: httpRequestsAdaptiveGroups(filter: $filter, limit: 10000) {
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
        pageviews: httpRequestsAdaptiveGroups(
          limit: 5000
          filter: $pageviewsFilter
        ) {
          request: count
          avg {
            sampleInterval
            __typename
          }
          dimensions {
            metric: clientRequestHTTPHost
            __typename
          }
          __typename
        }
        api: httpRequestsAdaptiveGroups(limit: 5000, filter: $apiFilter) {
          request: count
          avg {
            sampleInterval
            __typename
          }
          sum {
            edgeResponseBytes
            __typename
          }
          dimensions {
            metric: clientRequestHTTPHost
            __typename
          }
          __typename
        }
        ${
          includeBotManagement
            ? gql`
          botTotal: httpRequestsAdaptiveGroups(
          filter: $botTotalFilter
          limit: 10000
          orderBy: [datetimeHour_ASC]
          ) {
            dimensions {
              ts: datetimeHour
              metric: clientRequestHTTPHost
              __typename
            }
            count
            avg {
              sampleInterval
              __typename
            }
            __typename
          }
          likelyHuman: httpRequestsAdaptiveGroups(
          filter: $likelyHumanFilter
          limit: 10000
          orderBy: [datetimeHour_ASC]
          ) {
            dimensions {
              ts: datetimeHour
              metric: clientRequestHTTPHost
              __typename
            }
            count
            avg {
              sampleInterval
              __typename
            }
            __typename
          }
        `
            : ""
        }
        __typename
      }
    }
  }
`;
};

function groupByMetric(data: AnalyticsData) {
  const groupedObj: Record<string, any> = {};

  // Process all scopes
  data.data.viewer.scope.forEach((scope) => {
    // Helper function to process each section
    const processSection = (section: any[], sectionName: string) => {
      section.forEach((item) => {
        const metric = item.dimensions.metric;
        if (!groupedObj[metric]) {
          groupedObj[metric] = {
            metric: metric,
          };
        }

        // Initialize section if it doesn't exist
        if (!groupedObj[metric][sectionName]) {
          groupedObj[metric][sectionName] = {
            requests: 0,
            dataTransferBytes: 0,
            visits: 0,
            botTotal: 0,
            likelyHuman: 0,
          };
        }

        // Add values from this scope
        groupedObj[metric][sectionName].requests +=
          item.request || item.count || 0;
        groupedObj[metric][sectionName].dataTransferBytes +=
          item.sum?.dataTransferBytes || 0;
        groupedObj[metric][sectionName].visits += item.sum?.visits || 0;
      });
    };

    // Process each section
    if (scope.api) {
      processSection(scope.api, "api");
    }
    if (scope.pageviews) {
      processSection(scope.pageviews, "pageviews");
    }
    if (scope.total) {
      processSection(scope.total, "total");
    }
    if (scope.botTotal) {
      processSection(scope.botTotal, "botTotal");
    }
    if (scope.likelyHuman) {
      processSection(scope.likelyHuman, "likelyHuman");
    }
  });

  // Convert object to array
  return Object.values(groupedObj);
}

export async function getAnalytics(
  apiToken: string,
  zoneIds: string[],
  since: string,
  until: string,
  includeBotManagement: boolean = false
) {
  const variables: AnalyticsVariables = {
    zoneTags: zoneIds,
    accountTag: "",
    filter: {
      AND: [
        {
          datetime_geq: since,
          datetime_leq: until,
        },
        { requestSource: "eyeball" },
      ],
    },
    pageviewsFilter: {
      AND: [
        {
          datetime_geq: since,
          datetime_leq: until,
        },
        { requestSource: "eyeball" },
        {
          AND: [
            {
              edgeResponseStatus: 200,
              edgeResponseContentTypeName: "html",
            },
          ],
        },
      ],
    },
    apiFilter: {
      AND: [
        { datetime_geq: since, datetime_leq: until },
        {
          OR: [
            { edgeResponseContentTypeName: "json" },
            { edgeResponseContentTypeName: "xml" },
            { edgeResponseContentTypeName: "grpc" },
            { edgeResponseContentTypeName: "grpcweb" },
          ],
        },
        { requestSource: "eyeball" },
      ],
    },

    botTotalFilter: {
      AND: [
        { datetime_geq: since, datetime_leq: until },
        { botScore_geq: 1, botScore_leq: 99 },
        { requestSource: "eyeball" },
      ],
    },
    likelyHumanFilter: {
      AND: [
        { datetime_geq: since, datetime_leq: until },
        { botScore_geq: 31, botScore_leq: 100 },
        { requestSource: "eyeball" },
      ],
    },
    order: "",
  };

  const data = await queryGraphQL<AnalyticsData, AnalyticsVariables>(
    apiToken,
    analyticsQuery(includeBotManagement),
    variables
  );

  // Group the data by metric
  const groupedData = groupByMetric(data);

  // Return in the correct structure matching AnalyticsData type
  return {
    success: true,
    errors: [],
    messages: [],
    result: groupedData,
  };
}
