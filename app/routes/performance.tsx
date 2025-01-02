import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Performance - Blazedash" },
    { name: "description", content: "Performance Dashboard" },
  ];
};

export default function Performance() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-10 blur-sm" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Performance Dashboard</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Detailed performance analytics and optimization tools are coming soon.
          Get ready for in-depth insights into your application's performance metrics.
        </p>
      </div>
    </div>
  );
}