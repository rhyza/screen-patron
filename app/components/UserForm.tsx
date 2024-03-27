import { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';

import { InstagramIcon, LinkIcon, TwitterIcon } from './Icons';
import InputImage from './InputImage';
import { userPlaceholderImage } from '~/assets';

type UserFormProps = {
  isDisabled?: boolean;
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
}: UserFormProps) {
  const navigate = useNavigate();
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
            fileLimit={2}
            iconClassName="mb-1 mr-1 rounded-full p-3 bg-gray-600"
            image={photo || userPlaceholderImage}
            imageClassName="rounded-full size-[16rem]"
            name="photo"
          />
        </div>
        <div className="flex justify-center">
          <Button
            className="w-32 bg-primary"
            isDisabled={submitDisabled}
            radius="none"
            type="submit"
          >
            Save
          </Button>
          <Button className="w-32" onPress={() => navigate(-1)} radius="none">
            Cancel
          </Button>
        </div>
      </div>
      <div className="flex-auto max-w-96 text-center md:text-left">
        <div className="flex items-center md:h-[16rem] w-full mb-4 md:m-0">
          <Input
            classNames={{
              label: [
                'text-3xl group-data-[filled-within=true]:scale-[.475]',
                'group-data-[filled-within=true]:-translate-y-[calc(38%_+_theme(fontSize.small)/2_-_8px)]',
              ],
              inputWrapper: 'h-20 bg-subtle',
              input: 'text-3xl',
            }}
            defaultValue={name}
            label="Name"
            name="name"
            radius="none"
            size="lg"
            type="text"
          />
        </div>
        <div className="grid gap-4">
          <Textarea
            classNames={{ inputWrapper: 'bg-subtle' }}
            defaultValue={bio}
            label="Bio"
            name="bio"
            radius="none"
          />
          <SocialInput
            defaultValue={instagram}
            label="Instagram"
            name="instagram"
            onValueChange={validateSocialInput}
            icon={<InstagramIcon />}
            startText="@"
          />
          <SocialInput
            defaultValue={twitter}
            label="Twitter"
            name="twitter"
            onValueChange={validateSocialInput}
            icon={<TwitterIcon />}
            startText="@"
          />
          <SocialInput
            defaultValue={website}
            label="Website"
            name="website"
            icon={<LinkIcon />}
            startText="https://"
          />
        </div>
      </div>
    </Form>
  );
}

function SocialInput({
  defaultValue,
  label,
  name,
  onValueChange,
  icon,
  startText,
}: {
  defaultValue: string | undefined;
  label: string;
  name: string;
  onValueChange?: (value: string) => void;
  icon: JSX.Element;
  startText: string;
}) {
  return (
    <Input
      classNames={{ inputWrapper: 'bg-subtle' }}
      defaultValue={defaultValue}
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
