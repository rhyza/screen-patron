import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { EmailOtpType } from '@supabase/supabase-js';

import { getSupabaseServerClient } from '~/db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const { supabase, headers } = getSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirect('/signin');
    }
    return redirect('/events', { headers });
  }
  return new Response('Authentication failed', {
    status: 400,
  });
}
