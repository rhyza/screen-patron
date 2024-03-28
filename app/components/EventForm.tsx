import { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import { Button } from '@nextui-org/react';

import { ButtonTab, ButtonTabs } from './ButtonTabs';
import EventInfoForm from './EventInfoForm';
import EventSettings from './EventSettings';
import InputImage from './InputImage';
import { eventPlaceholderImage } from '~/assets';

type EventFormProps = {
  id?: string;
  defaultTab?: string;
  isDisabled?: boolean;
} & EventFormValues;

type EventFormValues = {
  name?: string;
  photo?: string;
  dateStart?: Date;
  dateEnd?: Date;
  location?: string;
  cost?: number;
  capacity?: number;
  description?: string;
};

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
            <ButtonTab id="info">Event Info</ButtonTab>
            {id && <ButtonTab id="settings">Settings</ButtonTab>}
          </ButtonTabs>
        )}
        {currentTab === 'info' && (
          <EventInfoForm setSubmitDisabled={setSubmitDisabled} {...eventFormValues} />
        )}
        {currentTab === 'settings' && (
          <EventSettings eventId={id} name={eventFormValues.name} />
        )}
      </div>
      <div className="flex-auto justify-center space-y-6 max-w-80 sm:max-w-96">
        <InputImage
          classNames={{ image: 'size-80 sm:size-96' }}
          fileLimit={5}
          image={photo || eventPlaceholderImage}
          name="photo"
        />
        <div className="flex justify-center">
          <Button
            className="w-32 bg-primary"
            isDisabled={submitDisabled}
            radius="none"
            type="submit"
          >
            Save
          </Button>
          <Button className="w-32" onPress={() => navigate(-1)} radius="none">
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}
