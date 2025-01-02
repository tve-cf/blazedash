import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label"; 
import { ComingSoonOverlay } from "~/components/ui/coming-soon-overlay";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { getZones } from "~/lib/api/zones.server";
import type { Zone } from "~/types/cloudflare";

type ActionData = 
  | { success: true; zones: Zone[]; message: string }
  | { success: false; error: string };

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const apiToken = formData.get("apiToken");

  if (!apiToken || typeof apiToken !== "string") {
    return json<ActionData>(
      { success: false, error: "API token is required" },
      { status: 400 }
    );
  }

  try {
    const zones = await getZones(apiToken);
    return json<ActionData>({ 
      success: true, 
      zones: zones.result,
      message: "API token saved and zones loaded successfully" 
    });
  } catch (error) {
    return json<ActionData>({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to load zones" 
    }, { status: 500 });
  }
}

export default function Settings() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [apiToken, setApiToken] = useState('');
  const isLoading = navigation.state === "submitting";

  useEffect(() => {
    const savedToken = localStorage.getItem('cfApiToken');
    if (savedToken) {
      setApiToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (actionData?.success) {
      localStorage.setItem('cfApiToken', apiToken);
      if ('zones' in actionData) {
        localStorage.setItem('cfZones', JSON.stringify(actionData.zones));
      }
    }
  }, [actionData, apiToken]);

  const handleReload = async () => {
    const form = new FormData();
    form.append("apiToken", apiToken);
    
    try {
      const response = await fetch("?index", {
        method: "POST",
        body: form,
      });
      
      const data = await response.json() as ActionData;
      if (data.success && 'zones' in data) {
        localStorage.setItem('cfZones', JSON.stringify(data.zones));
        alert('Zones reloaded successfully!');
      } else if (!data.success) {
        alert(data.error || 'Failed to reload zones');
      }
    } catch (error) {
      alert('Failed to reload zones');
      console.error('Error reloading zones:', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <div className="relative space-y-6">
        <Form method="post" className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiToken">API Token</Label>
                {apiToken && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReload}
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                    Reload Zones
                  </Button>
                )}
              </div>
              <Input
                id="apiToken"
                name="apiToken"
                type="password"
                placeholder="Enter your API token"
                required
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
              {actionData && !actionData.success && (
                <p className="text-sm text-destructive">{actionData.error}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Your API token will be securely stored in your browser's local storage.
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Your API token must have the following permissions:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Account Analytics:Read</li>
                  <li>All zones:
                    <ul className="list-disc pl-5">
                      <li>Zone:Read</li>
                      <li>DNS:Read</li>
                      <li>Analytics:Read</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Form>

        <div className="mt-12 space-y-6">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          <div className="relative rounded-lg border p-6">
            <ComingSoonOverlay />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data Store Schedule</Label>
                <p className="text-sm text-muted-foreground">Set up automated data export schedules</p>
              </div>
              <div className="space-y-2">
                <Label>Alert Configuration</Label>
                <p className="text-sm text-muted-foreground">Configure alert thresholds and notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}