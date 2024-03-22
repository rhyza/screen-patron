import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { NextUIProvider } from '@nextui-org/react';

import NavBar from '~/components/NavBar';
import { getSession, getSupabaseServerClient } from './db.server';
import stylesheet from '~/tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = getSupabaseServerClient(request);
  const session = await getSession(supabase);

  return json({ session }, { headers });
};

export default function App() {
  const { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="dark text-foreground bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <NavBar />
          <Outlet context={session} />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );
}
