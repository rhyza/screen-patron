import { useState } from 'react';
import { Button, Tooltip } from '@nextui-org/react';

/**
 * Renders a button to share the current page. On desktop, it copies the URL to the user's
 * clipboard. On mobile, it opens the native share dialog.
 * @param eventId The id of the event to share
 */
export default function ShareLinks({ eventId }: { eventId: string }) {
  const useLocal = process.env.NODE_ENV === 'development';
  const url = useLocal ? 'http://localhost:5173/' : 'https://screenpatron.com/';

  const [isOpen, setIsOpen] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Screen Patron',
        text: 'Check out this event!',
        url: `${url}${eventId}`,
      });
    } catch (err) {
      navigator.clipboard.writeText(`${url}${eventId}`);
      setIsOpen(() => true);
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <Tooltip
        closeDelay={1000}
        content={'Link copied!'}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
      >
        <Button className="link" onPress={handleShare}>
          share event
        </Button>
      </Tooltip>
    </div>
  );
}
