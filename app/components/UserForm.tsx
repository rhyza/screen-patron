import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';

import { InstagramIcon, LinkIcon, TwitterIcon } from './Icons';
import InputImage from './InputImage';

type UserFormValues = {
  name?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  instagram?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
};

export default function UserForm({
  name, avatar, bio, instagram, twitter, website,
}: UserFormValues) {
  const navigate = useNavigate();

  const socialInput = (
    defaultValue: string | undefined,
    label: string,
    name: string,
    icon: JSX.Element,
    startText: string
  ) => {
    return (
      <Input
        defaultValue={defaultValue}
        name={name}
        placeholder={label}
        radius='none'
        size='sm'
        startContent={
          <div className='flex gap-2 items-center'>
            {icon}
            <span className='ml-1 text-sm text-neutral-500'>{startText}</span>
          </div>
        }
        type='text'
      />
    );
  };

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap md:flex-nowrap gap-6 justify-center' method='post'>
        <div className='flex-auto space-y-6 max-w-fit min-w-80'>
          <div className='flex justify-center'>
            <InputImage
              iconClassName='mb-1 mr-1 rounded-full p-3 bg-gray-600'
              image={avatar}
              imageClassName='rounded-full size-[16rem]'
              name='avatar'
            />
          </div>
          <div className='flex justify-center'>
            <Button className='w-32 bg-primary' radius='none' type='submit'>Save</Button>
            <Button className='w-32' onPress={() => navigate(-1)} radius='none'>Cancel</Button>
          </div>
        </div>
        <div className='flex-auto max-w-96 text-center md:text-left'>
          <div className='flex items-center md:h-[16rem] w-full mb-4 md:m-0'>
            <Input
              defaultValue={name}
              label='Name'
              name='name'
              radius='none'
              size='lg'
              type='text'
            />
          </div>
          <div className='grid gap-4'>
            <Textarea
              defaultValue={bio}
              label='Bio'
              name='bio'
              radius='none'
            />
            {socialInput(instagram, 'Instagram', 'instagram', <InstagramIcon />, '@')}
            {socialInput(twitter, 'Twitter', 'twitter', <TwitterIcon />, '@')}
            {socialInput(website, 'Website', 'website', <LinkIcon />, 'https://')}
          </div>
        </div>
      </Form>
    </div>
  );
}