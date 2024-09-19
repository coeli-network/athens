import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import { Navbar } from "./components/ui/navbar";

import styles from "./tailwind.css?url";

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

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
  {
    rel: "stylesheet",
    href: styles,
  },
];

import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Athens</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <div className="container mx-auto p-4">
          <ScrollRestoration />
          <Scripts />
          <Outlet />
        </div>
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <Layout>
      <p>Loading...</p>
    </Layout>
  );
}
