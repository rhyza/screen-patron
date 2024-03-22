import { useNavigate } from '@remix-run/react';
import { Card, CardFooter } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import { EventInfo } from '~/models/event.server';
import { getDateString, getTimeString, retypeNull } from '~/utils';

/**
 * Pressable Card component featuring an event's poster and information.
 * Sends user to the event page on press.
 * @param event Event object containing `id`, `name`, `dateStart`, and `cost` info
 * @param imageClassName (optional) Use Tailwind classes to modify the look of the Card,
 * default value is `size-80`
 * @param cardProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Card docs for available options
 */
export default function EventCard({
  event: { id, name, photo, dateStart, cost },
  imageClassName = 'size-80',
  ...cardProps
}: {
  event: EventInfo;
  imageClassName?: string;
  [x: string]: any;
}) {
  const date = dateStart ? new Date(dateStart) : undefined;
  const dateString = date ? getDateString({ date: date }) : 'Date TBD';
  const timeString = date ? getTimeString({ date: date }) : 'Time TBD';
  const costString = cost ? `$${cost}` : 'Free';

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
      <img
        alt={`Event poster for ${name} event poster`}
        className={'object-cover rounded-md ' + imageClassName}
        src={retypeNull(photo, eventPlaceholderImage)}
      />
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
