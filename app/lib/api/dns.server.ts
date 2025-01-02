import { fetchCloudflare } from "./cloudflare.server";
import { DNSRecordSchema } from "~/lib/schemas/cloudflare";
import type { CloudflareResponse, DNSRecord } from "~/types/cloudflare";

export async function getDNSRecords(
  apiToken: string,
  zoneId: string
): Promise<CloudflareResponse<DNSRecord[]>> {
  return fetchCloudflare(
    `/zones/${zoneId}/dns_records?type=A,AAAA,CNAME`,
    apiToken,
    DNSRecordSchema
  );
}