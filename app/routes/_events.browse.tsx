import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

import CostPicker from '~/components/CostPicker';
import DatePicker from '~/components/DatePicker';
import EventCards from '~/components/EventCards';

import { getEvents } from '~/models/event.server';
import { isValidDate, returnIfValid, retypeAsNum } from '~/utils/validate';

export const meta: MetaFunction = () => {
  return [
    { title: 'Browse Events | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams;
  const costMin = params.get('costMin') || 0;
  const costMax = params.get('costMax') || 100;
  const dateMin = params.get('dateMin') || Date.now();
  const dateMax = params.get('dateMax') || undefined;
  const events = await getEvents({
    dateStart: {
      gte: returnIfValid(new Date(dateMin), isValidDate) || new Date(Date.now()),
      lte: dateMax && returnIfValid(new Date(dateMax), isValidDate),
    },
    OR: [
      {
        cost: {
          gte: retypeAsNum(costMin) || undefined,
          lte: retypeAsNum(costMax) || undefined,
        },
      },
      { cost: !retypeAsNum(costMin) ? null : undefined },
    ],
  });

  return json({ events });
};

/**
 * `/browse` — Page for exploring local public events.
 */
export default function BrowseEvents() {
  const { events } = useLoaderData<typeof loader>();
  const cities = [
    { id: 'nyc', name: 'New York, NY' },
    { id: 'la', name: 'Los Angeles, CA' },
    { id: 'chi', name: 'Chicago, IL' },
  ];

  return (
    <>
      <div className="flex gap-2 p-2">
        <Autocomplete
          allowsCustomValue
          aria-label="Select City"
          classNames={{
            base: 'max-w-44',
          }}
          defaultItems={cities}
          defaultSelectedKey="nyc"
          inputProps={{
            classNames: {
              input: 'ml-1',
              inputWrapper: 'h-10 !bg-default',
            },
          }}
          isClearable={false}
          radius="full"
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
        <DatePicker />
        <CostPicker />
      </div>
      <EventCards events={events} />
    </>
  );
}
