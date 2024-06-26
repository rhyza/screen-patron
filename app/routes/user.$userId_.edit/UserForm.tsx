import { useState } from 'react';
import { Form } from '@remix-run/react';
import { Input, Textarea } from '@nextui-org/react';

import { userPlaceholderImage } from '~/assets';
import DualButton from '~/components/DualButton';
import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';
import InputImage from '~/components/InputImage';

type UserFormProps = {
  isDisabled?: boolean;
  isSubmitting?: boolean;
} & UserFormValues;

type UserFormValues = {
  name?: string;
  photo?: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
};

/**
 * Form for modifying a User's name, bio, profile photo, instagram handle, twitter handle,
 * and website link.
 * @param UserFormValues Any User info to pre-populate the field data with
 * @param isDisabled Sets submit button to disabled
 */
export default function UserForm({
  name,
  photo,
  bio,
  instagram,
  twitter,
  website,
  isDisabled = false,
  isSubmitting = false,
}: UserFormProps) {
  const [submitDisabled, setSubmitDisabled] = useState(isDisabled);

  const validateSocialInput = (value: string) => {
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('@')
    ) {
      setSubmitDisabled(() => true);
    } else {
      setSubmitDisabled(() => false);
    }
  };

  return (
    <Form
      className="flex flex-wrap md:flex-nowrap gap-6 justify-center"
      encType="multipart/form-data"
      method="post"
    >
      <div className="flex-auto space-y-6 max-w-fit min-w-80">
        <div className="flex justify-center">
          <InputImage
            classNames={{
              iconContainer: 'mb-1 mr-1',
              image: 'rounded-full size-[16rem]',
            }}
            fileLimit={2}
            image={photo || userPlaceholderImage}
            isPending={isSubmitting}
            name="photo"
          />
        </div>
        <div className="flex justify-center">
          <DualButton isSubmitting={isSubmitting} submitDisabled={submitDisabled} />
        </div>
      </div>
      <fieldset
        className="flex-auto max-w-96 text-center md:text-left"
        disabled={isSubmitting}
      >
        <div className="flex items-center md:h-[16rem] w-full mb-4 md:m-0">
          <Input
            classNames={{
              label: [
                'text-3xl group-data-[filled-within=true]:scale-[.475]',
                'group-data-[filled-within=true]:-translate-y-[calc(38%_+_theme(fontSize.small)/2_-_8px)]',
              ],
              inputWrapper: 'h-20',
              input: 'text-3xl',
            }}
            defaultValue={name}
            isDisabled={isSubmitting}
            label="Name"
            name="name"
            radius="none"
            size="lg"
            type="text"
          />
        </div>
        <div className="grid gap-4">
          <Textarea
            defaultValue={bio}
            isDisabled={isSubmitting}
            label="Bio"
            name="bio"
            radius="none"
          />
          <SocialInput
            defaultValue={instagram}
            isDisabled={isSubmitting}
            label="Instagram"
            name="instagram"
            onValueChange={validateSocialInput}
            icon={<InstagramIcon />}
            startText="@"
          />
          <SocialInput
            defaultValue={twitter}
            isDisabled={isSubmitting}
            label="Twitter"
            name="twitter"
            onValueChange={validateSocialInput}
            icon={<TwitterIcon />}
            startText="@"
          />
          <SocialInput
            defaultValue={website}
            isDisabled={isSubmitting}
            label="Website"
            name="website"
            icon={<LinkIcon />}
            startText="https://"
          />
        </div>
      </fieldset>
    </Form>
  );
}

/**
 * Renders a text input field with a leading icon and text that indicates to the user how
 * their input should be formatted.
 */
function SocialInput({
  defaultValue,
  icon,
  isDisabled = false,
  label,
  name,
  onValueChange,
  startText,
}: {
  defaultValue: string | undefined;
  icon: JSX.Element;
  isDisabled?: boolean;
  label: string;
  name: string;
  onValueChange?: (value: string) => void;
  startText: string;
}) {
  return (
    <Input
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      name={name}
      onValueChange={onValueChange}
      placeholder={label}
      radius="none"
      size="sm"
      startContent={
        <div className="flex gap-2 items-center">
          {icon}
          <span className="ml-1 text-sm text-neutral-500">{startText}</span>
        </div>
      }
      type="text"
    />
  );
}
