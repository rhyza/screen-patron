import { Card, CardFooter, Image } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { validateFile } from '~/utils';
import EditIcon from './Icons';

export default function InputImage({ size = 200 }) {
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

  return (
    <Card shadow="sm" isPressable onPress={handleImageUpload} radius='none'>
      <input
        accept='image/*'
        className='sr-only'
        id='avatarUpload'
        onChange={handleImagePreview}
        ref={fileUploadRef}
        type='file'
      />
      <Image
        className={`object-cover h-[${size}px]`}
        fallbackSrc={`https://via.placeholder.com/${size}x${size}`}
        height={size}
        id='image-preview'
        radius='none'
        src={imageSrc}
        width={size}
      />
      <CardFooter className="overflow-hidden absolute justify-end inset-x-0 bottom-0 text-small z-10">
        <div aria-hidden='true' className='rounded-full p-2 bg-gradient-to-r from-cyan-500 to-blue-500'>
          <EditIcon fill='white' />
        </div>
      </CardFooter>
    </Card>
  );
}