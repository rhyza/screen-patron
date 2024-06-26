import { ChangeEvent, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CircularProgress,
  Image,
  VisuallyHidden,
  cn,
} from '@nextui-org/react';

import { EditIcon, ExclamationOutlineIcon } from './Icons';
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
      <Card isPressable onPress={handleImageUpload} radius="sm" {...cardProps}>
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
        <Image
          alt="Preview of uploaded file"
          className={cn(
            'object-cover rounded-[10px] size-80',
            isPending && 'brightness-50',
            classNames?.image,
          )}
          src={src}
        />
        {(error || errorMessage) && (
          <CardBody className="overflow-hidden absolute inset-0 z-10">
            <div className="flex justify-between overflow-hidden z-10 rounded-full border-2 border-red-600/85 bg-black/80 shadow-small py-1 px-1 text-center drop-shadow-sm">
              <ExclamationOutlineIcon />
              <span className="justify-self-end">{error || errorMessage}</span>
              <div />
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
              isPending && 'bg-default-100',
              classNames?.iconContainer,
            )}
          >
            <EditIcon fill={isPending ? 'gray' : classNames?.iconSvgFill || 'white'} />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
