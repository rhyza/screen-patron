import { Card, CardFooter } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { EditIcon } from './Icons';
import { validateFile } from '~/utils';

/**
 * File input component that shows a preview of the uploaded image.
 * @param fileLimit file size limit in MB
 * @param image img src link
 * @param imageClassName img tag className string for use with tailwind
 * @param cardProps InputImage accepts any number of additional props to apply
 * to the containing Card component
 */
export default function InputImage({
  fileLimit = 5,
  iconClassName = 'rounded-full p-3 bg-gray-600',
  iconFillColor = 'white',
  image = 'https://placehold.co/800?text=Upload&font=roboto',
  imageClassName = 'size-80',
  ...cardProps
}) {
  const [src, setSrc] = useState(image);
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, fileLimit)) {
      const files = event.target.files || [];
      setSrc(URL.createObjectURL(files[0]));
    }
  };

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  cardProps = {radius: 'none', shadow: 'sm', ...cardProps};

  return (
    <Card {...cardProps} isPressable onPress={handleImageUpload}>
      <input
        accept='image/*'
        className='sr-only'
        id='avatarUpload'
        onChange={handleImagePreview}
        ref={fileUploadRef}
        type='file'
      />
      <img
        className={'object-cover ' + imageClassName}
        src={src}
      />
      <CardFooter className='overflow-hidden absolute justify-end inset-x-0 bottom-0 z-10'>
        <div aria-hidden='true' className={iconClassName}>
          <EditIcon fill={iconFillColor} />
        </div>
      </CardFooter>
    </Card>
  );
}