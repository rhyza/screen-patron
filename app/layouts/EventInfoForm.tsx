import { useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';

import { MapPinIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';

import type { EventFormValues } from '~/models/event.server';
import { getDateInputString, getLocalTimeZone, getTimeZones } from '~/utils/format';

type EventFormProps = {
  isDisabled?: boolean;
  setSubmitDisabled: (x: boolean | (() => boolean)) => void;
} & EventFormValues;

export default function EventInfoForm({
  name,
  dateStart,
  dateEnd,
  timeZone,
  location,
  cost,
  capacity,
  description,
  isDisabled = false,
  setSubmitDisabled,
}: EventFormProps) {
  const today = getDateInputString(Date.now(), timeZone);
  const start = dateStart ? getDateInputString(dateStart, timeZone) : '';
  const end = dateEnd ? getDateInputString(dateEnd, timeZone) : '';

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
    } else if (startValue < today) {
      setSubmitDisabled(() => true);
      setErrorMessage(() => `You can't a start date in the past.`);
    } else if (startValue < endValue) {
      setSubmitDisabled(() => false);
      setErrorMessage(() => '');
    } else {
      setSubmitDisabled(() => true);
      setErrorMessage(() => 'The end date is before the start date.');
    }
  };

  return (
    <fieldset className="flex-auto space-y-2 min-w-[300px] max-w-xl" disabled={isDisabled}>
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
      <Autocomplete
        defaultSelectedKey={timeZone || getLocalTimeZone()}
        inputProps={{
          classNames: { inputWrapper: 'bg-subtle data-[hover=true]:bg-subtle-hover' },
        }}
        label="Time Zone"
        name="timeZone"
        radius="none"
      >
        {getTimeZones().map((tz) => (
          <AutocompleteItem key={tz} value={tz}>
            {tz.replaceAll('_', ' ')}
          </AutocompleteItem>
        ))}
      </Autocomplete>
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
    </fieldset>
  );
}
