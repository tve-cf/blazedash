import { z } from "zod";
import { CloudflareAPIError } from "~/lib/errors";
import { CloudflareResponseSchema } from "~/lib/schemas/cloudflare";
import { BASE_URL, fetchWithTimeout } from "./base";

export async function fetchCloudflare<T>(
  endpoint: string,
  apiToken: string,
  schema: z.ZodType<T>
): Promise<T> {
  if (!apiToken) {
    throw new CloudflareAPIError("API token is required", 400);
  }

  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    
    // Validate basic response structure first
    const parsedResponse = CloudflareResponseSchema.safeParse(data);
    
    if (!parsedResponse.success) {
      throw new CloudflareAPIError(
        "Invalid response format from Cloudflare API",
        response.status,
        [{ code: 0, message: "Response validation failed" }]
      );
    }

    if (!response.ok || !parsedResponse.data.success) {
      const error = parsedResponse.data.errors[0];
      throw new CloudflareAPIError(
        error?.message || `API request failed with status ${response.status}`,
        response.status,
        parsedResponse.data.errors
      );
    }

    // Validate specific response data
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new CloudflareAPIError(
        "Invalid response data format",
        response.status,
        [{ code: 0, message: "Response data validation failed" }]
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof CloudflareAPIError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new CloudflareAPIError(
        "Invalid response format",
        500,
        [{ code: 0, message: error.message }]
      );
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new CloudflareAPIError(
          "Request timed out",
          408,
          [{ code: 0, message: "The request took too long to complete" }]
        );
      }

      if (error.message.includes("Failed to fetch")) {
        throw new CloudflareAPIError(
          "Unable to connect to Cloudflare API",
          503,
          [{ code: 0, message: "Please check your internet connection" }]
        );
      }

      throw new CloudflareAPIError(
        error.message,
        500,
        [{ code: 0, message: "An unexpected error occurred" }]
      );
    }

    throw new CloudflareAPIError(
      "Unknown error occurred",
      500,
      [{ code: 0, message: "An unexpected error occurred" }]
    );
  }
}