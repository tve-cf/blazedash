import { z } from "zod";
import { CloudflareAPIError } from "~/lib/errors";
import { CloudflareResponseSchema } from "~/lib/schemas/cloudflare";

export const BASE_URL = "https://api.cloudflare.com/client/v4";

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 30000
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