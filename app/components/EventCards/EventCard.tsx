import { useNavigate } from '@remix-run/react';
import { Card, CardFooter, Image, cn } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import type { EventCardInfo } from '~/models/event.server';
import { getDateString, getLocalTimeZone, getTimeString } from '~/utils/format';
import { retypeNull } from '~/utils/validate';

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
  event: { id, name, photo, dateStart, timeZone, cost },
  imageClassName,
  ...cardProps
}: {
  event: EventCardInfo;
  imageClassName?: string;
} & React.ComponentPropsWithRef<typeof Card>) {
  const date = dateStart ? new Date(dateStart) : undefined;
  const includeTimeZone = timeZone ? timeZone != getLocalTimeZone() : false;

  const dateString = date ? getDateString({ date, timeZone }) : 'Date TBD';
  const timeString = date ? getTimeString({ date, timeZone, includeTimeZone }) : 'Time TBD';
  const costString = cost ? `$${cost}` : 'Free';

  const navigate = useNavigate();
  const handlePress = () => {
    navigate('/' + id);
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
      <Image
        alt={`Event poster for ${name} event poster`}
        className={cn('object-cover size-80', imageClassName)}
        radius="md"
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
