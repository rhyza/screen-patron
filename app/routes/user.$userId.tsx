import { Button } from '@nextui-org/react';
import InputImage from '~/components/InputImage';

export default function User() {
  const isUser = true;
  const name = 'Anonymous Patron';
  const photo = 'https://placehold.co/800?text=Profile+Picture&font=roboto';

  return (
    <div className='w-full p-6'>
    <div className='flex flex-wrap md:flex-nowrap gap-6 justify-center'>
      <div className='flex-auto space-y-4 max-w-fit min-w-80'>
        <div className='flex justify-center'>
          {isUser
          ? <InputImage
              iconClassName='mb-1 mr-1 rounded-full p-3 bg-gray-600'
              image={photo}
              imageClassName='rounded-full size-[16rem]'
            />
          : <img
              className='rounded-full size-[16rem]'
              src={photo}
            />
          }
        </div>
        <div className='flex justify-center'>
          {isUser && <Button className='' radius='none'>Edit Profile</Button>}
        </div>
      </div>
      <div className='flex-auto max-w-96 text-center md:text-left'>
        <div className='flex items-center md:h-[16rem] w-fit'>
          <h1 className='text-6xl md:text-7xl font-medium'>{name}</h1>
        </div>
        <p className='my-6 md:m-0'>Joined Feb '24</p>
      </div>
    </div>
  </div>
  )
}