import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAnalytics } from "~/lib/api/analytics";
import { CloudflareAPIError } from "~/lib/errors";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const zones = formData.getAll("zones");
    const since = formData.get("since");
    const until = formData.get("until");
    const apiToken = formData.get("token");

    if (!apiToken || typeof apiToken !== "string") {
      throw new CloudflareAPIError("API token is required", 401);
    }

    if (!zones.length) {
      throw new CloudflareAPIError("No zones selected", 400);
    }

    if (!since || typeof since !== "string") {
      throw new CloudflareAPIError("Start date is required", 400);
    }

    if (!until || typeof until !== "string") {
      throw new CloudflareAPIError("End date is required", 400);
    }

    const analytics = await getAnalytics(apiToken, zones as string[], since, until);
    return Response.json(analytics);
  } catch (error) {
    console.error("Analytics API Error:", error);
    if (error instanceof CloudflareAPIError) {
      return Response.json(
        { 
          success: false, 
          error: error.message,
          errors: error.errors 
        }, 
        { status: error.status || 500 }
      );
    }
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }, 
      { status: 500 }
    );
  }
}