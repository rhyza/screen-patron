import { Button, Card, CardFooter, Image, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { Form } from '@remix-run/react';
import { validateFile } from '~/utils';
import InputImage from './InputImage';

export default function ScreeningForm() {
  const [imageSrc, setImageSrc] = useState('');
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, 5)) {
      const files = event.target.files || [];
      setImageSrc(URL.createObjectURL(files[0]));
    }
  };

  const fileUploadRef = useRef<HTMLInputElement>(null);;
  const handleImageUpload = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
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
        <InputImage />
      </Form>
      <Form>
        <Button>Save</Button>
      </Form>
    </div>
  );
}