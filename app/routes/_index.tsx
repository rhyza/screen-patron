import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import ScreeningCard from '~/components/ScreeningCard';
import type { ScreeningRecord } from '~/services/screening';
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
    <div className='w-full p-6 flex justify-center'>
      {screenings.length ? (
        <div className='max-w-[70rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {screenings.map((screening: ScreeningRecord) => (
            <div key={screening.id} className='flex max-w-[400px] min-w-64'>
              <ScreeningCard screening={screening} />
            </div>
          ))}
        </div>
      ) :
        <p><i>No screenings</i></p>
      }
    </div>
  );
}
