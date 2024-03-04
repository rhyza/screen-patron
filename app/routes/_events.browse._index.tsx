import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { getEvents } from '~/services/event';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const events = await getEvents(q);
  return json({ events, q });
};

export default function BrowseEvents() {
  const { events, q } = useLoaderData<typeof loader>();
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
          classNames={{
            base: 'max-w-44',
          }}
          defaultItems={cities}
          defaultSelectedKey="nyc"
          inputProps={{
            classNames: {
              input: 'ml-1',
              inputWrapper: 'h-10 bg-default',
            },
          }}
          isClearable={false}
          radius="full"
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
        <Button radius="full">Date</Button>
        <Button radius="full">Cost</Button>
      </div>
      <EventCards events={events} />
    </>
  );
}