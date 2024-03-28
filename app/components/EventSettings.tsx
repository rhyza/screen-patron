import { Form } from '@remix-run/react';
import { Button } from '@nextui-org/react';

export default function EventSettings({ eventId }: { eventId: string }) {
  return (
    <div className="px-1 py-8">
      <Form action={`/e/${eventId}/delete`} method="post">
        <Button color="danger" radius="none" type="submit">
          Cancel Event
        </Button>
      </Form>
    </div>
  );
}
