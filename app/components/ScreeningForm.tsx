import { Button, Card, CardFooter, Image, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';
import { Form } from '@remix-run/react';
import { validateFile } from '~/utils';

export default function ScreeningForm() {
  const [imageSrc, setImageSrc] = useState('');
  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, 5)) {
      const files = event.target.files || [];
      setImageSrc(URL.createObjectURL(files[0]));
    }
  };

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
        <Image
          className='object-cover h-[200px]'
          fallbackSrc='https://via.placeholder.com/200x200'
          height={200}
          id='avatarPreview'
          radius='none'
          src={imageSrc}
          width={200}
        />
        <input
          accept='image/*'
          className='block w-full text-sm text-slate-500 file:mr-4 file:py-2
            file:px-4 file:rounded-full file:border-0 file:text-sm
            file:font-semibold file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100'
          id='avatarUpload'
          onChange={previewImage}
          type='file'  
           />
      </Form>
      <Form>
        <Button>Save</Button>
      </Form>
    </div>
  );
}