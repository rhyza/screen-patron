import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { NextUIProvider } from '@nextui-org/react';

import NavBar from '~/components/NavBar';
import { getSession, getSupabaseServerClient } from './db.server';
import { getUser } from './models/user.server';
import styles from '~/tailwind.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  const user = session?.user?.id ? await getUser(session?.user?.id) : null;

  return json({ session, user }, { headers });
};

export default function App() {
  const { session, user } = useLoaderData<typeof loader>();

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
          <NavBar sessionUser={user} />
          <Outlet context={{ session, user }} />
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}
