import { Button, Modal, ModalBody, ModalContent, cn, useDisclosure } from '@nextui-org/react';
import { PlayIcon } from '~/components/Icons';

/**
 * Modal for displaying videos in 16:9 aspect ratio.
 * @param link Either a YouTube or Vimeo link
 */
export default function VideoModal({ link }: { link: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const embedCode = link.split('/').pop();
  let embedSrc;
  if (link.includes('vimeo')) {
    embedSrc = 'https://player.vimeo.com/video/' + embedCode;
  } else {
    embedSrc = 'https://www.youtube.com/embed/' + embedCode;
  }

  return (
    <>
      <Button className="link" onPress={onOpen} radius="none" startContent={<PlayIcon />}>
        Play Trailer
      </Button>
      <Modal
        className="aspect-video max-h-full overflow-clip m-2"
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        radius="sm"
        shouldBlockScroll
        size="5xl"
      >
        <ModalContent className="dark">
          <ModalBody className="p-6">
            <iframe
              allow={cn(
                'accelerometer; autoplay; clipboard-write; encrypted-media;',
                'gyroscope; picture-in-picture; web-share',
              )}
              allowFullScreen
              className="absolute inset-0 w-full aspect-video"
              referrerPolicy="strict-origin-when-cross-origin"
              src={embedSrc}
              title="Trailer"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
