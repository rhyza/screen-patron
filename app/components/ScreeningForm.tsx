import { Button, Input } from '@nextui-org/react';
import { Form } from '@remix-run/react';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const today = new Date(Date.now());

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap-reverse gap-6 justify-center'>
        <div className='flex-auto space-y-2 max-w-2xl min-w-[360px]'>
          <Input label='Event' radius='none' type='text' />
          <Input label='Location' radius='none' type='text' />
          <Input
            label='Start Date'
            min={today.toLocaleDateString('fr-CA') + 'T00:00'}
            placeholder='TBD'
            radius='none'
            type='datetime-local'
          />
        </div>
        <div className='flex-auto items-center justify-center max-w-96'>
          <InputImage imageClassName='size-96' />
        </div>
      </Form>
      <Form>
        <Button>Save</Button>
      </Form>
    </div>
  );
}