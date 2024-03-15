import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';

import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';
import { getDateInputString } from '~/utils';

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

export default function EventForm({
  name,
  photo,
  dateStart,
  dateEnd,
  location,
  cost,
  capacity,
  description,
}: EventFormValues) {
  const navigate = useNavigate();
  const today = getDateInputString(new Date(Date.now()));
  const start = dateStart ? getDateInputString(dateStart) : '';
  const end = dateEnd ? getDateInputString(dateEnd) : '';

  return (
    <div className="w-full p-6">
      <Form className="flex flex-wrap-reverse justify-center gap-6" method="post">
        <div className="flex-auto space-y-2 min-w-[300px] max-w-xl">
          <Input
            defaultValue={name}
            label="Event Name"
            name="name"
            radius="none"
            size="lg"
            type="text"
          />
          <Input
            defaultValue={start}
            label="Start Date"
            min={today}
            name="dateStart"
            placeholder="TBD"
            radius="none"
            type="datetime-local"
          />
          <Input
            defaultValue={location}
            placeholder="Location"
            name="location"
            radius="none"
            startContent={<MapPinIcon />}
            type="text"
          />
          <Input
            defaultValue={`${capacity}`}
            name="capacity"
            placeholder="Max Capacity"
            radius="none"
            startContent={<UserGroupIcon />}
            type="number"
          />
          <Input
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
            defaultValue={description}
            name="description"
            label="Description"
            radius="none"
          />
        </div>
        <div className="flex-auto justify-center space-y-6 max-w-80 sm:max-w-96">
          <InputImage image={photo} imageClassName="size-80 sm:size-96" />
          <div className="flex justify-center">
            <Button className="w-32 bg-primary" radius="none" type="submit">
              Save
            </Button>
            <Button className="w-32" onPress={() => navigate(-1)} radius="none">
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
