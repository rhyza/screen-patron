import { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';

import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';
import { eventPlaceholderImage } from '~/assets';
import { getDateInputString } from '~/utils';

type EventFormProps = {
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
  name,
  photo,
  dateStart,
  dateEnd,
  location,
  cost,
  capacity,
  description,
  isDisabled = false,
}: EventFormProps) {
  const navigate = useNavigate();
  const today = getDateInputString(new Date(Date.now()));
  const start = dateStart ? getDateInputString(dateStart) : '';
  const end = dateEnd ? getDateInputString(dateEnd) : '';

  const [errorMessage, setErrorMessage] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(isDisabled);
  const [showEndDateInput, setShowEndDateInput] = useState(end != '');

  const [dateStartValue, setDateStartValue] = useState(start);
  const handleDateStartInput = (value: string) => {
    setDateStartValue(() => value);
    validateDateInputs(value, dateEndValue);
  };

  const [dateEndValue, setDateEndValue] = useState(end);
  const handleDateEndInput = (value: string) => {
    setDateEndValue(() => value);
    validateDateInputs(dateStartValue, value);
  };

  const validateDateInputs = (startValue: string, endValue: string) => {
    if (!endValue) {
      setSubmitDisabled(() => false);
      setErrorMessage(() => '');
    } else if (!startValue) {
      setSubmitDisabled(() => true);
      setErrorMessage(() => `You can't have an end date without a start date.`);
    } else if (new Date(startValue) < new Date(Date.now())) {
      setSubmitDisabled(() => true);
      setErrorMessage(() => `You can't a start date in the past.`);
    } else if (new Date(startValue) < new Date(endValue)) {
      setSubmitDisabled(() => false);
      setErrorMessage(() => '');
    } else {
      setSubmitDisabled(() => true);
      setErrorMessage(() => 'The end date is before the start date.');
    }
  };

  return (
    <Form
      className="flex flex-wrap-reverse justify-center gap-6"
      encType="multipart/form-data"
      method="post"
    >
      <div className="flex-auto space-y-2 min-w-[300px] max-w-xl">
        <Input
          classNames={{
            label: [
              'text-3xl group-data-[filled-within=true]:scale-[.475]',
              'group-data-[filled-within=true]:-translate-y-[calc(38%_+_theme(fontSize.small)/2_-_8px)]',
            ],
            inputWrapper: 'h-20 bg-subtle',
            input: 'text-3xl',
          }}
          defaultValue={name}
          label="Event Name"
          name="name"
          radius="none"
          size="lg"
          type="text"
        />
        <Input
          classNames={{ inputWrapper: 'bg-subtle' }}
          label="Start Date"
          min={today}
          name="dateStart"
          onValueChange={handleDateStartInput}
          placeholder="TBD"
          radius="none"
          type="datetime-local"
          value={dateStartValue}
        />
        {showEndDateInput && (
          <Input
            classNames={{ inputWrapper: 'bg-subtle' }}
            errorMessage={errorMessage}
            label="End Date"
            min={today}
            name="dateStart"
            onValueChange={handleDateEndInput}
            placeholder="TBD"
            radius="none"
            type="datetime-local"
            value={dateEndValue}
          />
        )}
        {dateStartValue && !showEndDateInput && (
          <Button
            className="btn-link"
            onPress={() => setShowEndDateInput(() => !showEndDateInput)}
          >
            Add end time
          </Button>
        )}
        <Input
          classNames={{ inputWrapper: 'bg-subtle' }}
          defaultValue={location}
          placeholder="Location"
          name="location"
          radius="none"
          startContent={<MapPinIcon />}
          type="text"
        />
        <Input
          classNames={{ inputWrapper: 'bg-subtle' }}
          defaultValue={`${capacity}`}
          name="capacity"
          placeholder="Max Capacity"
          radius="none"
          startContent={<UserGroupIcon />}
          type="number"
        />
        <Input
          classNames={{ inputWrapper: 'bg-subtle' }}
          defaultValue={`${cost}`}
          name="cost"
          placeholder="Cost per person"
          radius="none"
          startContent={
            <>
              <TicketIcon />
              <span className="ml-1">$</span>
            </>
          }
          type="number"
        />
        <Textarea
          classNames={{ inputWrapper: 'bg-subtle' }}
          defaultValue={description}
          name="description"
          label="Description"
          radius="none"
        />
      </div>
      <div className="flex-auto justify-center space-y-6 max-w-80 sm:max-w-96">
        <InputImage
          fileLimit={5}
          image={photo || eventPlaceholderImage}
          imageClassName="size-80 sm:size-96"
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
