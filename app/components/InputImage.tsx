import { ChangeEvent, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CircularProgress,
  cn,
  VisuallyHidden,
} from '@nextui-org/react';

import { EditIcon } from './Icons';
import { uploadPlaceholderImage } from '~/assets';
import { validateFile } from '~/utils/validate';

/**
 * File input component that shows a preview of the uploaded image.
 * @param fileLimit (optional) File size limit in MB, default value is 2 MB
 * @param image (optional) img tag src link
 * @param imageClassName (optional) Any Tailwind classes to apply to the img tag
 * @param cardProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Card docs for available options
 */
export default function InputImage({
  classNames,
  errorMessage,
  fileLimit = 2,
  image,
  name = 'photo',
  isPending = false,
  ...cardProps
}: {
  classNames?: {
    iconContainer?: string;
    iconSvgFill?: string;
    image?: string;
  };
  errorMessage?: string;
  fileLimit?: number;
  image?: string;
  name?: string;
  isPending?: boolean;
} & React.ComponentPropsWithRef<typeof Card>) {
  const [error, setError] = useState('');
  const [src, setSrc] = useState(image || uploadPlaceholderImage);
  const handleImagePreview = (event: ChangeEvent<HTMLInputElement>) => {
    if (validateFile(event, fileLimit)) {
      const files = event.target.files || [];
      setSrc(() => URL.createObjectURL(files[0]));
      setError('');
    } else {
      setError(`The file size limit is ${fileLimit} MB.`);
    }
  };

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  cardProps = {
    className: 'bg-transparent',
    radius: 'none',
    shadow: 'none',
    ...cardProps,
  };

  return (
    <>
      <Card {...cardProps} isPressable onPress={handleImageUpload}>
        <VisuallyHidden>
          <input
            accept="image/*"
            id="avatarUpload"
            name={name}
            onChange={handleImagePreview}
            ref={fileUploadRef}
            type="file"
          />
        </VisuallyHidden>
        <input className="hidden" name="prevPhoto" readOnly type="text" value={image}></input>
        <img
          alt="Preview of uploaded file"
          className={cn(
            'object-cover size-80',
            isPending && 'brightness-50',
            classNames?.image,
          )}
          src={src}
        />
        {(error || errorMessage) && (
          <CardBody className="overflow-hidden absolute justify-center inset-0 z-10">
            <div className="overflow-hidden z-10 rounded-large bg-red-800/65 shadow-small py-1 px-4 text-center drop-shadow-sm">
              {error || errorMessage}
            </div>
          </CardBody>
        )}
        {isPending && (
          <CardBody className="overflow-hidden absolute justify-center items-center inset-0 z-10">
            <CircularProgress classNames={{ svg: 'w-40 h-40' }} color="default" />
          </CardBody>
        )}
        <CardFooter className="overflow-hidden absolute inset-x-0 bottom-0 z-10 justify-end">
          <div
            aria-hidden="true"
            className={cn(
              'rounded-full p-3 bg-default',
              isPending && 'bg-default-100/80',
              classNames?.iconContainer,
            )}
          >
            <EditIcon fill={classNames?.iconSvgFill || 'white'} />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
