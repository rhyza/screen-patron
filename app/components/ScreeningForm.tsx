import { Button, Input } from '@nextui-org/react';
import { Form } from '@remix-run/react';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const today = new Date(Date.now());

  return (
    <div className='max-w-md space-y-2'>
      <Form className='max-w-md space-y-2'> 
        <Input label='Event' radius='none' type='text' />
        <Input label='Location' radius='none' type='text' />
        <Input
          label='Start Date'
          min={today.toLocaleDateString('fr-CA') + 'T00:00'}
          placeholder='TBD'
          radius='none'
          type='datetime-local'
        />
        <InputImage />
      </Form>
      <Form>
        <Button>Save</Button>
      </Form>
    </div>
  );
}