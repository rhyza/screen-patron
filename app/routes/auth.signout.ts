import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { getSupabaseServerClient } from '~/db.server';
import { signOut } from '~/models/user.server';

/**
 * API endpoint users are directed to after pressing "Sign Out".
 * No page is rendered.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  const { error } = await signOut(supabase);

  if (!error) {
    return redirect('/browse', { headers });
  } else {
    console.log(error);
  }
}
