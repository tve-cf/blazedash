export interface ZoneHttpRequestsAdaptiveFilter {
    clientRequestPath?: {
      like?: string;
    };
    botScore?: {
      gt?: number;
      lt?: number;
    };
    cacheStatus?: {
      in?: string[];
    };
    clientCountryName?: {
      in?: string[];
    };
    clientDeviceType?: {
      in?: string[];
    };
    clientRequestHTTPMethodName?: {
      in?: string[];
    };
    edgeResponseStatus?: {
      in?: number[];
    };
    datetime?: {
      geq?: string;
      leq?: string;
  };
}
