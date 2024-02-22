import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ScreeningForm from '~/components/ScreeningForm';
import { ScreeningRecord, getScreening, updateScreening } from '~/services/screening';
import { invariant } from 'framer-motion';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  if (!params.screeningId) {
    invariant(false, 'Missing screeningId param');
    return;
  }
  const formData = await request.formData();
  console.log(formData.get('name'));
  const updates = Object.fromEntries(formData);
  await updateScreening(params.screeningId, updates);
  return redirect(`/screening/${params.screeningId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const screening: ScreeningRecord | null = await getScreening(params.screeningId);
	if (!screening) {
		throw new Response('Not Found', {status: 404});
	}
	return json({ screening });
};

export default function EditScreening() {
  const { screening } = useLoaderData<typeof loader>();

  return (
    <ScreeningForm {...screening} />
  );
}