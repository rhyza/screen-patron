import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import EventForm from '~/components/EventForm';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { createEvent } from '~/models/event.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

/**
 * `e/create` — Page for creating a new Event.
 */
export default function CreateEvent() {
  return <EventForm />;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || !session?.user?.id) {
    throw redirect(`/signin`, 302);
  }

  const values = Object.fromEntries(await formData);
  const event = await createEvent(session?.user?.id, { ...values });
  return redirect(`/e/${event.id}`);
};
