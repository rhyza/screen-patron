import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { EmailOtpType } from '@supabase/supabase-js';

import { getSupabaseServerClient } from '~/db.server';

/**
 * API endpoint users are directed to after clicking a Magic Link, confirming their log in.
 * No page is rendered.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType;

  if (token_hash && type) {
    const { supabase, headers } = getSupabaseServerClient(request);
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return redirect('/events', { headers });
    } else {
      console.log(error);
    }
  }
  return new Response('Authentication failed', {
    status: 400,
  });
}
