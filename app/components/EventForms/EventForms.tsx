import { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';

import EventInfoForm from './EventInfoForm';
import EventSettingsDropdown from './EventSettingsDropdown';
import { eventPlaceholderImage } from '~/assets';
import { ButtonTab, ButtonTabs } from '~/components/ButtonTabs';
import DualButton from '~/components/DualButton';
import InputImage from '~/components/InputImage';
import type { EventFormValues } from '~/models/event.server';

type EventFormProps = {
  id?: string;
  defaultTab?: string;
  isDisabled?: boolean;
  isSubmitting?: boolean;
} & EventFormValues;

/**
 * Form for modifying an Event's basic information as well as its settings. Basic info and
 * settings are organized under tabs. The settings tab and navigation only appears if the
 * Event already exists.
 * @param eventFormValues Any Event info to pre-populate the field data with
 * @param id (optional) The `eventId` if the Event already exists
 * @param isDisabled Sets submit button to disabled
 * @param isSubmitting Disables the form after submitting the form to the database
 * @param photo The Event's poster image
 */
export default function EventForms({
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
          <DualButton isSubmitting={isSubmitting} submitDisabled={submitDisabled} />
        </div>
      </div>
    </Form>
  );
}
