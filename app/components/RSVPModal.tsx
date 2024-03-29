import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react';

import RSVPForm from './RSVPForm';
import RSVPModalTrigger from './RSVPModalTrigger';
import type { RsvpInfo } from '~/models/rsvp.server';
import SignInFlow from './SignInFlow';

/**
 * Modal containing for use in the RSVP flow.
 * @param modalProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Modal docs for available options
 */
export default function RSVPModal({
  content = 'rsvpForm',
  rsvp,
  ...modalProps
}: {
  rsvp: RsvpInfo | null;
} & Partial<React.ComponentPropsWithRef<typeof Modal>>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [status, setStatus] = useState(rsvp?.status as string);
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setStatus(() => id);
    onOpen();
  };

  return (
    <>
      <RSVPModalTrigger response={rsvp?.status} onTrigger={handleModalOpen} />
      <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} {...modalProps}>
        <ModalContent className="dark">
          {(onClose) => (
            <ModalBody className="p-6">
              {content === 'rsvpForm' && <RSVPForm onClose={onClose} selected={status} />}
              {content === 'rsvpConfirmed' && (
                <div className="grid content-center justify-center my-8">
                  <p className="text-2xl text-center">Your RSVP has been updated!</p>
                </div>
              )}
              {(content === 'signIn' || content === 'signInConfirmed') && (
                <SignInFlow hasEmailSent={content === 'signInConfirmed'} />
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
