import { Button, Link } from '@nextui-org/react';
import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';
import InputImage from '~/components/InputImage';

export default function User() {
  const isUser = true;
  const name = 'Anonymous Patron';
  const photo = 'https://placehold.co/800?text=Profile+Picture&font=roboto';
  const bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const instagram = undefined; //'rhyza_';
  const twitter = undefined; //'remix_run';
  const website = 'https://tailwindcss.com/';

  const socialChip = (label: string, url: string, icon: JSX.Element) => {
    return (
      <Button
        as={Link}
        className='bg-gradient-to-br from-indigo-500 to-pink-500 text-white'
        href={url}
        isExternal
        radius='full'
        size='sm'
        startContent={icon}
      >
        {label}
      </Button>
    );
  };

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
        <div className='flex items-center md:h-[16rem] w-fit mb-4 md:m-0'>
          <h1 className='text-6xl md:text-7xl font-medium'>{name}</h1>
        </div>
        {true && <p className='mb-4'>{bio}</p>}
        {(instagram || twitter || website) &&
          <div className='flex gap-2 mb-4 justify-center md:justify-start'>
            {instagram &&
              socialChip(`@${instagram}`, `https://www.instagram.com/${instagram}`, <InstagramIcon className='w-4 h-4'/>)
            }
            {twitter &&
              socialChip(`@${twitter}`, `https://www.twitter.com/${twitter}`, <TwitterIcon className='w-4 h-4'/>)
            }
            {website &&
              socialChip('Website', website, <LinkIcon className='w-5 h-5'/>)
            }
          </div>
        }
        <p className='mb-4'>Joined Feb '24</p>
      </div>
    </div>
  </div>
  )
}