import { NavLink } from '@remix-run/react';
import { Button, Link } from '@nextui-org/react';

import { userPlaceholderImage } from '~/assets';
import { InstagramIcon, LinkIcon, TwitterIcon } from '~/components/Icons';

type UserProfileProps = {
  isUser?: boolean;
} & UserProfileValues;

type UserProfileValues = {
  name?: string | null;
  photo?: string | null;
  bio?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  website?: string | null;
};

/**
 * Displays a User's name, bio, profile photo, instagram handle, twitter handle,
 * and website link.
 * @param UserProfileValues Any User info to show
 * @param isUser Determines whether a user is viewing their own profile
 */
export default function UserProfile({
  name,
  photo,
  bio,
  instagram,
  twitter,
  website,
  isUser,
}: UserProfileProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-6 justify-center">
      <div className="flex-auto space-y-6 max-w-fit min-w-80">
        <div className="flex justify-center">
          <img
            alt={name ? `${name}'s profile photo` : `Anonymous Patron's profile photo`}
            className="rounded-full object-cover size-64"
            src={photo || userPlaceholderImage}
          />
        </div>
        <div className="flex justify-center">
          {isUser && (
            <Button as={NavLink} className="w-64" to="./edit" radius="none">
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="flex-auto max-w-96 text-center md:text-left">
        <div className="flex items-center md:h-64 w-fit mb-4 md:m-0">
          <h1 className="text-6xl md:text-7xl font-medium">{name || 'Anonymous Patron'}</h1>
        </div>
        <div className="grid gap-4">
          {bio && <p>{bio}</p>}
          {(instagram || twitter || website) && (
            <div className="flex gap-2 justify-center md:justify-start">
              {instagram && (
                <SocialChip
                  label={`@${instagram}`}
                  url={`https://www.instagram.com/${instagram}`}
                  icon={<InstagramIcon className="w-4 h-4" />}
                />
              )}
              {twitter && (
                <SocialChip
                  label={`@${twitter}`}
                  url={`https://www.twitter.com/${twitter}`}
                  icon={<TwitterIcon className="w-4 h-4" />}
                />
              )}
              {website && (
                <SocialChip
                  label="Website"
                  url={`https://${website}`}
                  icon={<LinkIcon className="w-5 h-5" />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialChip({ label, url, icon }: { label: string; url: string; icon: JSX.Element }) {
  return (
    <Button
      as={Link}
      className="bg-gradient"
      href={url}
      isExternal
      radius="full"
      size="sm"
      startContent={icon}
    >
      {label}
    </Button>
  );
}
