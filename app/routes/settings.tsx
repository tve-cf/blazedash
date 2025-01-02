import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label"; 
import { ComingSoonOverlay } from "~/components/ui/coming-soon-overlay";
import { useEffect, useState } from "react";

export default function Settings() {
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    // Load saved token on component mount
    const savedToken = localStorage.getItem('cfApiToken');
    if (savedToken) {
      setApiToken(savedToken);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (apiToken) {
      localStorage.setItem('cfApiToken', apiToken);
      alert('API Token saved successfully!');
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
        <Form className="space-y-8" method="post" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token</Label>
              <Input
                id="apiToken"
                name="apiToken"
                type="password"
                placeholder="Enter your API token"
                required
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
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

          <Button type="submit" className="w-full sm:w-auto">
            Save Settings
          </Button>
        </Form>

        <div className="mt-12 space-y-6">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          <div className="relative rounded-lg border p-6">
            <ComingSoonOverlay showDescription={false} />
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