import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import EventForm from '~/components/EventForm';
import { createEvent } from '~/services/event';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const hosts = { userId: { id: 'userId', status: 'going' } };
  const event = await createEvent({ ...values, hosts });
  return redirect(`/e/${event.id}`);
};

export default function CreateEvent() {
  return <EventForm />;
}
