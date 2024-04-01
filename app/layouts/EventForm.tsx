import { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import { ButtonTab, ButtonTabs } from '~/components/ButtonTabs';
import DeleteEventModal from '~/components/DeleteEventModal';
import { EllipsisVerticalIcon, PendingIcon } from '~/components/Icons';
import InputImage from '~/components/InputImage';
import EventInfoForm from '~/layouts/EventInfoForm';
import type { EventFormValues } from '~/models/event.server';

type EventFormProps = {
  id?: string;
  defaultTab?: string;
  isDisabled?: boolean;
  isSubmitting?: boolean;
} & EventFormValues;

/**
 * Form for modifying an Event's name, description, poster, start date, end date,
 * location, cost, and venue capacity.
 * @param EventFormValues Any Event info to pre-populate the field data with
 * @param isDisabled Sets submit button to disabled
 */
export default function EventForm({
  id,
  defaultTab = 'info',
  photo,
  isDisabled = false,
  isSubmitting = false,
  ...eventFormValues
}: EventFormProps) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [submitDisabled, setSubmitDisabled] = useState(isDisabled);

  const setTabContent = (id: string) => {
    setCurrentTab(() => id);
    return id;
  };

  return (
    <Form
      className="flex flex-wrap-reverse justify-center gap-6"
      encType="multipart/form-data"
      method="post"
    >
      <div className="flex-auto space-y-2 min-w-[300px] max-w-xl">
        {id && (
          <ButtonTabs className="pb-2" defaultTab="info" setTabContent={setTabContent}>
            <ButtonTab id="info" isDisabled={isSubmitting}>
              Event Info
            </ButtonTab>
            <EventSettingsDropdown
              eventId={id}
              isDisabled={isSubmitting}
              name={eventFormValues?.name || undefined}
            />
          </ButtonTabs>
        )}
        {currentTab === 'info' && (
          <EventInfoForm
            isDisabled={isSubmitting}
            setSubmitDisabled={setSubmitDisabled}
            {...eventFormValues}
          />
        )}
      </div>
      <div className="flex-auto justify-center space-y-6 max-w-80 sm:max-w-96">
        <InputImage
          classNames={{ image: 'size-80 sm:size-96' }}
          fileLimit={5}
          image={photo || eventPlaceholderImage}
          isPending={isSubmitting}
          name="photo"
        />
        <div className="flex justify-center">
          <Button
            className="w-32 bg-primary"
            isDisabled={submitDisabled || isSubmitting}
            radius="none"
            startContent={isSubmitting && <PendingIcon />}
            type="submit"
          >
            Save
          </Button>
          <Button
            className="w-32"
            isDisabled={isSubmitting}
            onPress={() => navigate(-1)}
            radius="none"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}

function EventSettingsDropdown({
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
