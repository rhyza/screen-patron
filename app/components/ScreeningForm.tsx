import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const navigate = useNavigate();
  const today = new Date(Date.now());

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap-reverse justify-center gap-6' method='post'>
        <div className='flex-auto space-y-2 min-w-[300px] max-w-xl'>
          <Input label='Event Name' radius='none' size='lg' type='text' />
          <Input
            label='Start Date'
            min={today.toLocaleDateString('fr-CA') + 'T00:00'}
            placeholder='TBD'
            radius='none'
            type='datetime-local'
          />
          <Input placeholder='Location' radius='none' startContent={<MapPinIcon />} type='text' />
          <Input
            placeholder='Max Capacity'
            radius='none'
            startContent={<UserGroupIcon />}
            type='number'
          />
          <Input placeholder='Cost per person' radius='none'
            startContent={<>
              <TicketIcon />
              <span className='ml-1'>$</span>
            </>}
            type='number'
          />
          <Textarea
            label='Description'
            radius='none'
          />
        </div>
        <div className='flex-auto justify-center max-w-80 sm:max-w-96'>
          <InputImage imageClassName='size-80 sm:size-96' />
        </div>
      </Form>
      <Form className='flex justify-center'>
        <Button className='m-6' onClick={() => navigate(-1)} radius='none' size='lg' type='submit'>Save</Button>
      </Form>
    </div>
  );
}