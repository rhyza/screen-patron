import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import EventForm from '~/components/EventForm';
import { createEvent } from '~/models/event.server';
import { invariant, stripFalseValues } from '~/utils';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = 'test'; // replace
  invariant(userId, "Missing signed in user's id");
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const event = await createEvent(userId, { ...values });
  return redirect(`/e/${event.id}`);
};

export default function CreateEvent() {
  return <EventForm />;
}
