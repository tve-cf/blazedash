import { z } from "zod";

export const CloudflareErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const CloudflareResponseSchema = z.object({
  success: z.boolean(),
  errors: z.array(CloudflareErrorSchema),
  messages: z.array(z.string()),
  result: z.any(),
});

export const ZoneSchema = CloudflareResponseSchema.extend({
  result: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export const DNSRecordSchema = CloudflareResponseSchema.extend({
  result: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["A", "AAAA", "CNAME"]),
      name: z.string(),
      content: z.string(),
    })
  ),
});