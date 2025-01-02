import { json } from "@remix-run/node";
import { getZones } from "~/lib/api/zones.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ success: false, errors: [{ message: "Missing API token" }] }, { status: 401 });
  }

  const apiToken = authHeader.replace("Bearer ", "");
  try {
    const zones = await getZones(apiToken);
    return json({ success: true, result: zones.result });
  } catch (error) {
    console.error("Error fetching zones:", error);
    return json(
      { 
        success: false, 
        errors: [{ message: error instanceof Error ? error.message : "Failed to fetch zones" }] 
      }, 
      { status: 500 }
    );
  }
} 