import { PrismaClient } from '@prisma/client';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parse, serialize } from '@supabase/ssr';
import { invariant, singleton } from './utils';

// Hard-code a unique key, so client can be looked up when this module gets re-imported
const prisma = singleton('prisma', getPrismaClient);
const supabase = getSupabaseClient();
const useLocal = false;

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

function getSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  invariant(typeof SUPABASE_URL === 'string', 'SUPABASE_URL env var not set');
  invariant(typeof SUPABASE_ANON_KEY === 'string', 'SUPABASE_ANON_KEY env var not set');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
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
    },
  );

  return { supabase, headers };
}

export { prisma, supabase, getSupabaseBrowserClient, getSupabaseServerClient };
