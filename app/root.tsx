import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";
import { Header } from "./components/layout/header";
import { DashboardNav } from "./components/layout/dashboard-nav";
import { AnalyticsProvider } from "./context/analytics-context";
import { ThemeProvider, useThemeClass } from "./hooks/use-theme";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function Document({ children }: { children: React.ReactNode }) {
  const themeClass = useThemeClass();

  return (
    <html lang="en" className={themeClass}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Document>
        <AnalyticsProvider>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <DashboardNav />
              <main className="flex-1 p-4 w-full">
                <Outlet />
              </main>
            </div>
          </TooltipProvider>
        </AnalyticsProvider>
      </Document>
    </ThemeProvider>
  );
}
