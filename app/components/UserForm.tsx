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

  return (
    <div className="w-full p-6">
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
              defaultValue={name}
              label="Name"
              name="name"
              radius="none"
              size="lg"
              type="text"
            />
          </div>
          <div className="grid gap-4">
            <Textarea defaultValue={bio} label="Bio" name="bio" radius="none" />
            <SocialInput
              defaultValue={instagram}
              label="Instagram"
              name="instagram"
              icon={<InstagramIcon />}
              startText="@"
            />
            <SocialInput
              defaultValue={twitter}
              label="Twitter"
              name="twitter"
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
    </div>
  );
}

function SocialInput({
  defaultValue,
  label,
  name,
  icon,
  startText,
}: {
  defaultValue: string | undefined;
  label: string;
  name: string;
  icon: JSX.Element;
  startText: string;
}) {
  return (
    <Input
      defaultValue={defaultValue}
      name={name}
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
