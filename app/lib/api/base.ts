import { z } from "zod";
import { CloudflareAPIError } from "~/lib/errors";
import { CloudflareResponseSchema } from "~/lib/schemas/cloudflare";

export const BASE_URL = "https://api.cloudflare.com/client/v4";

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function queryGraphQL<T, V = unknown>(
  apiToken: string,
  query: string,
  variables: V,
): Promise<T> {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseData = await response.json<T>();

  if (!response.ok) {
    console.error("GraphQL Error Response:", {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  return responseData;
}
