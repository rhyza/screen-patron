import { redirect } from '@remix-run/node';
import ScreeningForm from '~/components/ScreeningForm';
import { createScreening } from '~/services/screening';
import type { ActionFunctionArgs } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const screening = await createScreening(values);
  return redirect(`/screening/${screening.id}`);
};

export default function CreateScreening() {
  return (
    <ScreeningForm />
  );
}