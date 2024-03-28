import { Form } from '@remix-run/react';
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

export default function EventSettings({
  eventId,
  name,
}: {
  eventId?: string;
  name?: string;
}) {
  return <>{eventId && <DeleteEventFlow eventId={eventId} name={name} />}</>;
}

function DeleteEventFlow({ eventId, name }: { eventId: string; name?: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="px-1 py-8">
      <Button color="danger" onPress={onOpen} radius="none">
        Cancel Event
      </Button>
      <Modal className="p-2" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <Form action={`/e/${eventId}/delete`} method="post">
                <ModalHeader className="flex flex-col gap-1">
                  <h1>
                    Are you sure you want to delete your event
                    {name && <span className="italic">, {name} </span>}?
                  </h1>
                </ModalHeader>
                <ModalBody>
                  <p>
                    {`You won't be able to retrieve any of the event information or data once
                    deleted.`}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose} radius="none" type="submit">
                    Yes, kill your darlings
                  </Button>
                  <Button onPress={onClose} radius="none">
                    No, wait, go back!
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
