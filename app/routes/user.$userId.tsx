import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Button, Link } from '@nextui-org/react';

import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';
import { getUser } from '~/services/user';
import { getDateString } from '~/utils';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = await getUser(params.userId);
  if (!user) {
    throw new Response('Not Found', {status: 404});
  }
  return json({ user });
};

// Remove Before Prod
const isUser = true;

export default function User() {
  const { user } = useLoaderData<typeof loader>();
  const {
    name = 'Anonymous Patron',
    avatar = 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9',
    bio,
    instagram,
    twitter,
    website,
    createdAt,
  } = user;
  const joinDate = getDateString({
    date: new Date(createdAt),
    includeWeekDay: false,
    includeDate: false,
    omitSameYear: false,
  });

  const renderSocialChip = (label: string, url: string, icon: JSX.Element) => {
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
        <div className='flex-auto space-y-6 max-w-fit min-w-80'>
          <div className='flex justify-center'>
            <img
              className='rounded-full object-cover size-64'
              src={avatar}
            />
          </div>
          <div className='flex justify-center'>
            {isUser &&
              <Button as={NavLink} className='w-64' to='./edit' radius='none'>
                Edit
              </Button>
            }
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
                {instagram && renderSocialChip(
                  `@${instagram}`,
                  `https://www.instagram.com/${instagram}`,
                  <InstagramIcon className='w-4 h-4'/>
                )}
                {twitter && renderSocialChip(
                  `@${twitter}`,
                  `https://www.twitter.com/${twitter}`,
                  <TwitterIcon className='w-4 h-4'/>
                )}
                {website && renderSocialChip(
                  'Website', website, <LinkIcon className='w-5 h-5'/>
                )}
              </div>
            }
            <p>Joined {joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
