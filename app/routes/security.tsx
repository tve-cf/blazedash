import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Security - Blazedashp" },
    { name: "description", content: "Security Dashboard" },
  ];
};

export default function Security() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-10 blur-sm" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Security Dashboard
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Advanced security monitoring and threat detection features are coming
          soon. Stay tuned for comprehensive security insights and controls.
        </p>
      </div>
    </div>
  );
}
