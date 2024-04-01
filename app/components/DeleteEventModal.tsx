import { Form } from '@remix-run/react';
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react';

export default function DeleteEventModal({
  eventId,
  name,
  isOpen,
  onOpenChange,
}: {
  eventId: string;
  name?: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
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
  );
}
