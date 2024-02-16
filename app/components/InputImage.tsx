import { Card, CardFooter, Image } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import EditIcon from './Icons';
import { validateFile } from '~/utils';

/**
 * File input component that shows a preview of the uploaded image.
 * @param size sets both width and length of image in pixels (overridden by width and height params)
 * @param fileLimit file size limit in MB
 */
export default function InputImage({ size = 200, width = 0, height = 0, fileLimit = 5 }) {
  const [imageSrc, setImageSrc] = useState('');
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, fileLimit)) {
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

  width = width || size;
  height = height || size;
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
        className={`object-cover h-[${height}px]`}
        fallbackSrc={`https://via.placeholder.com/${width}x${height}`}
        height={height}
        id='image-preview'
        radius='none'
        src={imageSrc}
        width={width}
      />
      <CardFooter className="overflow-hidden absolute justify-end inset-x-0 bottom-0 text-small z-10">
        <div aria-hidden='true' className='rounded-full p-2 bg-gradient-to-r from-cyan-500 to-blue-500'>
          <EditIcon fill='white' />
        </div>
      </CardFooter>
    </Card>
  );
}