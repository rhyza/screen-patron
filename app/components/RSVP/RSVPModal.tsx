import { useEffect, useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { useFetcher, useOutletContext } from '@remix-run/react';
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react';

import RSVPForm from './RSVPForm';
import RSVPModalTrigger from './RSVPModalTrigger';
import SignInFlow from '~/components/SignInFlow';
import type { OutletContext } from '~/db.server';
import type { RsvpInfo } from '~/models/rsvp.server';

/**
 * Modal containing for use in the RSVP flow.
 * @param rsvp The RSVPInfo object
 * @param modalProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Modal docs for available options
 */
export default function RSVPModal({
  rsvp,
  ...modalProps
}: {
  rsvp: RsvpInfo | null;
} & Partial<React.ComponentPropsWithRef<typeof Modal>>) {
  const { session } = useOutletContext<OutletContext>();

  const fetcher = useFetcher<{ success: string | null; error: string | null }>();
  const fetcherData = fetcher.data?.success;

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState('');

  // Set the corresponding RSVP status in the Modal when Modal Trigger is pressed
  const [status, setStatus] = useState(rsvp?.status as string);
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setStatus(() => id);
    onOpen();
  };

  // Show confirmation messages on each successful submission
  useEffect(() => {
    if (session) {
      setContent(fetcherData ? 'rsvpConfirmed' : 'rsvpForm');
    } else {
      setContent(fetcherData ? 'signInConfirmed' : 'signIn');
    }
  }, [fetcherData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close confirmation messages after 2 seconds
  useEffect(() => {
    if (content === 'rsvpConfirmed') {
      setTimeout(() => onClose(), 2000);
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  // When confirmation messages are closed, reset the modal to a form
  useEffect(() => {
    if (isOpen === false) {
      if (content === 'rsvpConfirmed') {
        setContent('rsvpForm');
      } else if (content === 'signInConfirmed') {
        setContent('signIn');
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <RSVPModalTrigger response={rsvp?.status} onTrigger={handleModalOpen} />
      <Modal
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        {...modalProps}
      >
        <ModalContent className="dark">
          {(onClose) => (
            <ModalBody className="p-6">
              {content === 'rsvpForm' && (
                <RSVPForm onClose={onClose} fetcher={fetcher} selected={status} />
              )}
              {content === 'rsvpConfirmed' && (
                <div className="grid content-center justify-center my-8">
                  <p className="text-2xl text-center">Your RSVP has been updated!</p>
                </div>
              )}
              {(content === 'signIn' || content === 'signInConfirmed') && (
                <SignInFlow fetcher={fetcher} />
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
