import { useNavigate } from '@remix-run/react';
import { Card, CardFooter } from '@nextui-org/react';

import { EventRecord } from '~/services/event';
import { getDateString, getTimeString } from '~/utils';

export default function EventCard({
  event,
  imageClassName = 'size-80',
  ...cardProps
}: {
  event: EventRecord;
  [propName: string]: any;
}) {
  const { id, name, coverImage, dateStart, cost } = event;
  const image = coverImage || 'https://placehold.co/800?text=Event&font=roboto';
  const date = dateStart ? new Date(dateStart) : undefined;
  const dateString = date ? getDateString({ date: date }) : 'Date TBD';
  const timeString = date ? getTimeString({ date: date }) : 'Time TBD';
  const costString = cost && cost > 0 ? `$${cost}` : 'Free';

  const navigate = useNavigate();
  const handlePress = () => {
    navigate('/e/' + id);
  };

  return (
    <Card
      className="flex-1 w-full bg-transparent p-2 text-foreground"
      isPressable
      key={id}
      onPress={handlePress}
      radius="sm"
      shadow="sm"
      {...cardProps}
    >
      <img className={'object-cover rounded-md ' + imageClassName} src={image} />
      <CardFooter className="flex flex-col items-start">
        <p className="text-xs uppercase font-bold">{dateString}</p>
        <p className="text-xs text-default-500">
          {timeString} - {costString}
        </p>
        <p className="text-base font-bold justify-self-start">{name}</p>
      </CardFooter>
    </Card>
  );
}
