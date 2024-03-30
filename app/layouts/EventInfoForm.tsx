import { useState } from 'react';
import { Button, Input, Textarea } from '@nextui-org/react';

import { MapPinIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';

import type { EventFormValues } from '~/models/event.server';
import { getDateInputString } from '~/utils/format';

type EventFormProps = {
  setSubmitDisabled: (x: boolean | (() => boolean)) => void;
} & EventFormValues;

export default function EventInfoForm({
  name,
  dateStart,
  dateEnd,
  location,
  cost,
  capacity,
  description,
  setSubmitDisabled,
}: EventFormProps) {
  const today = getDateInputString(new Date(Date.now()));
  const start = dateStart ? getDateInputString(dateStart) : '';
  const end = dateEnd ? getDateInputString(dateEnd) : '';

  const [errorMessage, setErrorMessage] = useState('');
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
    <>
      <Input
        classNames={{
          label: [
            'text-3xl group-data-[filled-within=true]:scale-[.475]',
            'group-data-[filled-within=true]:-translate-y-[calc(38%_+_theme(fontSize.small)/2_-_8px)]',
          ],
          inputWrapper: 'h-20 bg-subtle data-[hover=true]:bg-subtle-hover',
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
        classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
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
          classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
          errorMessage={errorMessage}
          label="End Date"
          min={today}
          name="dateEnd"
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
        classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
        defaultValue={location}
        placeholder="Location"
        name="location"
        radius="none"
        startContent={<MapPinIcon />}
        type="text"
      />
      <Input
        classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
        defaultValue={`${capacity}`}
        name="capacity"
        placeholder="Max Capacity"
        radius="none"
        startContent={<UserGroupIcon />}
        type="number"
      />
      <Input
        classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
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
        classNames={{ inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' }}
        defaultValue={description}
        name="description"
        label="Description"
        radius="none"
      />
    </>
  );
}
