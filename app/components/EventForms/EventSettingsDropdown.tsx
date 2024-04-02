import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';

import DeleteEventModal from './DeleteEventModal';
import { EllipsisVerticalIcon } from '~/components/Icons';

export default function EventSettingsDropdown({
  eventId,
  name,
  isDisabled = false,
}: {
  eventId: string;
  name?: string;
  isDisabled?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Dropdown backdrop="opaque">
        <DropdownTrigger>
          <Button isDisabled={isDisabled} isIconOnly radius="full" variant="light">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Settings Menu">
          <DropdownSection className="hidden" title="Actions" showDivider>
            <DropdownItem description="Make your event public" key="publish">
              Publish Event
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem
              className="text-danger"
              color="danger"
              description="Permanently delete this event"
              key="delete"
              onPress={onOpen}
            >
              Cancel Event
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <DeleteEventModal
        eventId={eventId}
        name={name}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
