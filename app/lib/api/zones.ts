import { fetchCloudflare } from "./cloudflare";
import { ZoneSchema } from "~/lib/schemas/cloudflare";
import type { CloudflareResponse, Zone } from "~/types/cloudflare";

export async function getZones(
  apiToken: string
): Promise<CloudflareResponse<Zone[]>> {
  return fetchCloudflare("/zones", apiToken, ZoneSchema);
}