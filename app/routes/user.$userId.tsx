import { NavLink } from '@remix-run/react';
import { Button, Link } from '@nextui-org/react';
import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';

export default function User() {
  const isUser = true;
  const name = 'Anonymous Patron';
  const photo = 'https://placehold.co/800?text=Profile+Picture&font=roboto';
  const bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const instagram = undefined; //'rhyza_';
  const twitter = undefined; //'remix_run';
  const website = 'https://tailwindcss.com/';
  const joinDate = 'Feb \'24';

  const socialChip = (label: string, url: string, icon: JSX.Element) => {
    return (
      <Button
        as={Link}
        className='bg-gradiant'
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
          <img
            className='rounded-full size-64'
            src={photo}
          />
        </div>
        <div className='flex justify-center'>
          {isUser && <Button as={NavLink} className='w-64' to='./edit' radius='none'>Edit</Button>}
        </div>
      </div>
      <div className='flex-auto max-w-96 text-center md:text-left'>
        <div className='flex items-center md:h-64 w-fit mb-4 md:m-0'>
          <h1 className='text-6xl md:text-7xl font-medium'>{name}</h1>
        </div>
        <div className='grid gap-4'>
          {bio && <p>{bio}</p>}
          {(instagram || twitter || website) &&
            <div className='flex gap-2 justify-center md:justify-start'>
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
          <p>Joined {joinDate}</p>
        </div>
      </div>
    </div>
  </div>
  )
}