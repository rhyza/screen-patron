import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import EventForm from '~/components/EventForm';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { createEvent } from '~/models/event.server';
import { invariant } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  invariant(session?.user?.id, "Missing signed in user's id");
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const event = await createEvent(session?.user?.id, { ...values });
  return redirect(`/e/${event.id}`);
};

export default function CreateEvent() {
  return <EventForm />;
}
