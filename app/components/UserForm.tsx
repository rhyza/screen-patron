import { Form, useNavigate } from '@remix-run/react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';
import InputImage from '~/components/InputImage';

export default function UserForm() {
  const userId = 1;
  const photo = 'https://placehold.co/800?text=Profile+Picture&font=roboto';
  const navigate = useNavigate();

  const socialInput = (label: string, icon: JSX.Element, startText: string) => {
    return (
      <Input
        placeholder={label}
        radius='none'
        size='sm'
        startContent={
          <div className='flex gap-2'>
            {icon}
            <span className='ml-1 text-neutral-500'>{startText}</span>
          </div>
        }
        type='text'
      />
    );
  };

  return (
    <div className='w-full p-6'>
      <Form className='flex flex-wrap md:flex-nowrap gap-6 justify-center' method='post'>
        <div className='flex-auto space-y-4 max-w-fit min-w-80'>
          <div className='flex justify-center'>
            <InputImage
              iconClassName='mb-1 mr-1 rounded-full p-3 bg-gray-600'
              image={photo}
              imageClassName='rounded-full size-[16rem]'
            />
          </div>
          <div className='flex justify-center'>
            <Button className='w-[8rem] bg-primary' onClick={() => navigate(-1)} radius='none' type='submit'>Save</Button>
            <Button className='w-[8rem]' onClick={() => navigate(-1)} radius='none'>Cancel</Button>
          </div>
        </div>
        <div className='flex-auto max-w-96 text-center md:text-left'>
          <div className='flex items-center md:h-[16rem] w-full mb-4 md:m-0'>
            <Input label='Name' radius='none' size='lg' type='text' />
          </div>
          <div className='grid gap-4'>
            <Textarea label='Description' radius='none' />
            {socialInput('Instagram', <InstagramIcon />, '@')}
            {socialInput('Twitter', <TwitterIcon />, '@')}
            {socialInput('Website', <LinkIcon />, 'https://')}
          </div>
        </div>
      </Form>
    </div>
  );
}