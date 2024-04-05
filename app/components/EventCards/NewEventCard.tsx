import { useNavigate } from '@remix-run/react';
import { Card, CardFooter, CardHeader, Image, cn } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';

/**
 * Pressable Card component for creating a new Event.
 * Sends user to the create event page on press.
 * @param cardProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Card docs for available options
 */
export default function NewEventCard({
  imageClassName,
  ...cardProps
}: { imageClassName?: string } & React.ComponentPropsWithRef<typeof Card>) {
  const navigate = useNavigate();
  const handlePress = () => {
    navigate('/create');
  };

  return (
    <Card
      className="flex-1 w-full bg-transparent p-2 text-foreground"
      isPressable
      key="new"
      onPress={handlePress}
      radius="sm"
      shadow="sm"
      {...cardProps}
    >
      <CardHeader className="absolute z-10 w-80 top-1 flex-col items-start">
        <p className="text-lg text-white/60 font-bold uppercase drop-shadow-sm">
          No Screenings
        </p>
      </CardHeader>
      <Image
        alt={`Event poster`}
        className={cn('object-cover rounded-[10px] size-80', imageClassName)}
        src={eventPlaceholderImage}
      />
      <CardFooter className="absolute z-10 w-80 bottom-1 flex-col items-end">
        <h4 className=" text-3xl font-medium text-white drop-shadow-sm">+ Create Your Own</h4>
      </CardFooter>
    </Card>
  );
}
