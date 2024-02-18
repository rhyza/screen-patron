import React from 'react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Form } from '@remix-run/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from './Icons';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const today = new Date(Date.now());

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap-reverse gap-6 justify-center'>
        <div className='flex-auto space-y-2 max-w-2xl min-w-[360px]'>
          <Input label='Event Name' radius='none' type='text' />
          <Input
            label='Start Date'
            min={today.toLocaleDateString('fr-CA') + 'T00:00'}
            placeholder='TBD'
            radius='none'
            type='datetime-local'
          />
          <Input placeholder='Location' radius='none' startContent={<MapPinIcon />} type='text' />
          <Input placeholder='Cost per person' radius='none'
            startContent={<>
              <TicketIcon />
              <span className='ml-1'>$</span>
            </>}
            type='number'
          />
          <Input
            placeholder='Max Capacity'
            radius='none'
            startContent={<UserGroupIcon />}
            type='number'
          />
          <Textarea
            label='Description'
            radius='none'
          />
        </div>
        <div className='flex-auto items-center justify-center max-w-96'>
          <InputImage imageClassName='size-96' />
        </div>
      </Form>
      <Form>
        <Button radius='none'>Save</Button>
      </Form>
    </div>
  );
}