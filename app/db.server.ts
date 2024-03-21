import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { Session } from '@remix-run/node';
import type { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parse, serialize } from '@supabase/ssr';
import { invariant, singleton } from './utils';

// Hard-code a unique key, so client can be looked up when this module gets re-imported
const prisma = singleton('prisma', getPrismaClient);
const supabase = singleton('supabase', getSupabaseBrowserClient);
const useLocal = false;

export type OutletContext = Session & {
  user: User;
};

/**
 * Get the current session if any.
 * @returns User object if someone is signed in else undefined.
 */
export async function getSession(client?: SupabaseClient<any, 'public', any>) {
  const {
    data: { session },
  } = client ? await client.auth.getSession() : await supabase.auth.getSession();

  return session;
}

function getPrismaClient() {
  const { DATABASE_URL, LOCAL_DATABASE_URL } = process.env;
  const url = useLocal ? LOCAL_DATABASE_URL : DATABASE_URL;
  invariant(typeof url === 'string', 'DATABASE_URL env var not set');

  const databaseUrl = new URL(url);

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });

  client.$connect();

  return client;
}

function getSupabaseBrowserClient() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  invariant(typeof SUPABASE_URL === 'string', 'SUPABASE_URL env var not set');
  invariant(typeof SUPABASE_ANON_KEY === 'string', 'SUPABASE_ANON_KEY env var not set');
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function getSupabaseServerClient(
  request: Request,
  options?: SupabaseClientOptions<'public'>,
) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  invariant(typeof SUPABASE_URL === 'string', 'SUPABASE_URL env var not set');
  invariant(typeof SUPABASE_ANON_KEY === 'string', 'SUPABASE_ANON_KEY env var not set');

  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  return { supabase, headers };
}

export { prisma, supabase, getSupabaseServerClient };
