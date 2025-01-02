import { z } from "zod";
import { CloudflareAPIError } from "~/lib/errors";

export function validateApiToken(token: unknown): string {
  if (!token || typeof token !== "string") {
    throw new CloudflareAPIError(
      "API token is required",
      400,
      [{ code: 0, message: "Missing or invalid API token" }]
    );
  }
  return token;
}

export function validateZoneId(zoneId: unknown): string {
  if (!zoneId || typeof zoneId !== "string") {
    throw new CloudflareAPIError(
      "Zone ID is required",
      400,
      [{ code: 0, message: "Missing or invalid zone ID" }]
    );
  }
  return zoneId;
}

export function validateHostname(hostname: unknown): string {
  if (!hostname || typeof hostname !== "string") {
    throw new CloudflareAPIError(
      "Hostname is required",
      400,
      [{ code: 0, message: "Missing or invalid hostname" }]
    );
  }
  return hostname;
}