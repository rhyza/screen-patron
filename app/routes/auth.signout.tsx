import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { getSupabaseServerClient } from '~/db.server';
import { signOut } from '~/models/user.server';

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  const { error } = await signOut(supabase);

  if (!error) {
    return redirect('/browse', { headers });
  }
}
