import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import ScreeningCards from '~/components/ScreeningCards';
import { getScreenings } from '~/services/screening';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const screenings = await getScreenings(q);
  return json({ screenings, q });
};

export default function Index() {
  const { screenings, q } = useLoaderData<typeof loader>();

  return (
    <ScreeningCards screenings={screenings} />
  );
}