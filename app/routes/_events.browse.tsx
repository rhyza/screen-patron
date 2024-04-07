import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { CalendarIcon } from '~/components/Icons';

import { getEvents } from '~/models/event.server';
import { retypeNull } from '~/utils/validate';
import CostPicker from '~/components/CostPicker';

export const meta: MetaFunction = () => {
  return [
    { title: 'Browse Events | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = retypeNull(url.searchParams.get('q'));
  const events = await getEvents({
    dateStart: {
      gte: new Date(Date.now()),
    },
  });
  return json({ events, q });
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
        <Button className="max-md:hidden" radius="full" startContent={<CalendarIcon />}>
          Date
        </Button>
        <Button
          className="md:hidden"
          isIconOnly
          radius="full"
          startContent={<CalendarIcon />}
        />
        <CostPicker />
      </div>
      <EventCards events={events} />
    </>
  );
}
