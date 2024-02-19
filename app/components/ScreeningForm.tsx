import { Button, Input, Textarea } from '@nextui-org/react';
import { Form } from '@remix-run/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const today = new Date(Date.now());

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap-reverse justify-center gap-6'>
        <div className='flex-auto space-y-2 min-w-[360px] max-w-2xl'>
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
        <div className='flex-auto justify-center max-w-[28rem]'>
          <InputImage imageClassName='size-[28rem]' />
        </div>
      </Form>
      <Form className='flex justify-center'>
        <Button className='m-6' radius='none' size='lg'>Save</Button>
      </Form>
    </div>
  );
}