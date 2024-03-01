import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';

type ScreeningFormValues = {
  name?: string | undefined;
  coverImage?: string | undefined;
  dateStart?: string | undefined;
  dateEnd?: string | undefined;
  location?: string | undefined;
  cost?: number | undefined;
  capacity?: number | undefined;
  description?: string | undefined;
};

export default function ScreeningForm({
  name, coverImage, dateStart, dateEnd, location, cost, capacity, description,
}: ScreeningFormValues) {
  const navigate = useNavigate();
  const today = new Date(Date.now());

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap-reverse justify-center gap-6' method='post'>
        <div className='flex-auto space-y-2 min-w-[300px] max-w-xl'>
          <Input
            defaultValue={name}
            label='Event Name'
            name='name'
            radius='none'
            size='lg'
            type='text'
          />
          <Input
            defaultValue={dateStart}
            label='Start Date'
            min={today.toLocaleDateString('fr-CA') + 'T00:00'}
            name='dateStart'
            placeholder='TBD'
            radius='none'
            type='datetime-local'
          />
          <Input
            defaultValue={location}
            placeholder='Location'
            name='location'
            radius='none'
            startContent={<MapPinIcon />}
            type='text'
          />
          <Input
            defaultValue={`${capacity}`}
            name='capacity'
            placeholder='Max Capacity'
            radius='none'
            startContent={<UserGroupIcon />}
            type='number'
          />
          <Input
            defaultValue={`${cost}`}
            name='cost'
            placeholder='Cost per person'
            radius='none'
            startContent={<>
              <TicketIcon />
              <span className='ml-1'>$</span>
            </>}
            type='number'
          />
          <Textarea
            defaultValue={description}
            name='description'
            label='Description'
            radius='none'
          />
        </div>
        <div className='flex-auto justify-center space-y-6 max-w-80 sm:max-w-96'>
          <InputImage image={coverImage} imageClassName='size-80 sm:size-96' />
          <div className='flex justify-center'>
            <Button className='w-32 bg-primary' radius='none' type='submit'>Save</Button>
            <Button className='w-32' onClick={() => navigate(-1)} radius='none'>Cancel</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}