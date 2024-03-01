import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import ScreeningForm from '~/components/ScreeningForm';
import { createScreening } from '~/services/screening';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const hosts = {'userId': {id: 'userId', status: 'going'}};
  const screening = await createScreening({...values, hosts});
  return redirect(`/screening/${screening.id}`);
};

export default function CreateScreening() {
  return (
    <ScreeningForm />
  );
}