import { Button, Card, CardFooter, Image, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';
import { Form } from '@remix-run/react';
import { validateFile } from '~/utils';
import EditIcon from './Icons';

export default function ScreeningForm() {
  const [imageSrc, setImageSrc] = useState('');
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, 5)) {
      const files = event.target.files || [];
      setImageSrc(URL.createObjectURL(files[0]));
    }
  };

  let fileUploadRef: HTMLInputElement | null;
  const handleImageUpload = () => {
    if (fileUploadRef) {
      fileUploadRef.click();
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
        <Card shadow="sm" isPressable onPress={handleImageUpload} radius='none'>
          <input
            accept='image/*'
            className='sr-only'
            id='avatarUpload'
            onChange={handleImagePreview}
            ref={(input) => fileUploadRef = input}
            type='file'  
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
          <CardFooter className="overflow-hidden absolute justify-end inset-x-0 bottom-0 text-small z-10">
            <Button aria-hidden='true' className='bg-gradient-to-r from-cyan-500 to-blue-500' disableAnimation isIconOnly radius='full'>
              <EditIcon aria-hidden='true' fill='white' />
            </Button>
          </CardFooter>
        </Card>
      </Form>
      <Form>
        <Button>Save</Button>
      </Form>
    </div>
  );
}