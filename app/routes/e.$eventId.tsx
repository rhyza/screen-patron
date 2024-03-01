import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Avatar, Button, Link, Tooltip, useDisclosure } from '@nextui-org/react';

import IconButton from '~/components/IconButton';
import { MapPinIcon, StarIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';
import RSVPModal from '~/components/RSVPModal';
import { getEvent, getGuestCount } from '~/services/event';
import { getDateString, getTimeString } from '~/utils';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const event = await getEvent(params.eventId);
  if (!event) {
    throw new Response('Not Found', {status: 404});
  }
  return json({event});
};

// Remove Before Prod
const isUser = true;
const isGuest = true;
const testDates = {
  startDay: 'February 22, 2024 19:00',
  endSameDay: 'February 22, 2024 21:00',
  endNextDay: 'February 23, 2024 1:00',
  nye: 'December 31, 2024 20:00',
  nyd: 'January 1, 2025 01:00',
};

export default function Event() {
  const { event } = useLoaderData<typeof loader>();
  const {
    name,
    coverImage = 'https://placehold.co/800?text=Poster&font=roboto',
    dateStart,
    dateEnd,
    location = 'Location TBD',
    cost = 0,
    capacity = 100,
    description,
    hosts = {},
    guests,
  } = event;
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;
  const guestCount = getGuestCount(guests);
  const host = Object.values(hosts)[0] || {
    avatar: undefined,
    name: 'Anonymous Filmmaker',
  };

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [rsvp, setRsvp] = useState('');
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setRsvp(() => id);
    onOpen();
  };

  const renderInfoField = (icon: JSX.Element, text: string | JSX.Element) => {
    return (
      <div className='flex items-center gap-2'>
        <span className='flex-none'>{icon}</span>
        <span className='flex-initial'>{text}</span>
      </div>
    );
  };

  const renderDateRange = (start: Date, end?: Date) => {
    let date = getDateString({date: start, omitSameYear: true});
    let time = getTimeString({date: start});

    if (end) {
      const endDate = getDateString({date: end, omitSameYear: true});
      const endTime = getTimeString({date: end});

      if (end.getDate() === start.getDate()) {
        time += ` — ${endTime}`;
      } else {
        if (end.getFullYear() != start.getFullYear()) {
          date = getDateString({date: start});
        }
        return (
          <div>
            <p className='text-2xl'>{date + ' · ' + time + ' — '}</p>
            <p className='text-2xl'>{endDate + ' · ' + endTime}</p>
          </div>
        );
      }
    }

    return (
      <div>
        <p className='text-3xl font-medium'>{date}</p>
        <p className='text-xl font-medium text-neutral-600'>{time}</p>
      </div>
    );
  };

  return (
    <div className='w-full p-6'>
      <div className='flex flex-wrap-reverse gap-6 justify-center'>
        <div className='flex-auto space-y-4 min-w-[300px] max-w-xl '>
          <div className='flex items-center gap-6'>
            <h1 className='text-5xl font-medium'>{name}</h1>
            {isUser &&
              <Button as={NavLink} to='./edit' radius='none'>Edit</Button>
            }
          </div>
          {start
            ? renderDateRange(start, end)
            : <p className='text-2xl font-medium'>Date & Time TBD</p>
          }
          {(isUser || isGuest) &&
            <div className='flex gap-6 items-center'>
              <Link className='btn-link mb-2' onPress={() => alert('share options')}>
                share
              </Link>
              <Link className='btn-link mb-2' isExternal href='https://calendar.google.com/'>
                add to calendar
              </Link>
            </div>
          }
          
          {renderInfoField(
            <StarIcon />,
            <div className='flex items-center gap-2'>
              Hosted by <Avatar showFallback src={host.avatar} /> {host.name}
            </div>
          )}
          {renderInfoField(<MapPinIcon />, location)}
          {cost != undefined && renderInfoField(
            <TicketIcon />, cost > 0 ? `$${cost} per person`: 'Free'
          )}
          {capacity && renderInfoField(
            <UserGroupIcon />,
            <p>
              <span className='text-primary'>{capacity - guestCount.going}</span>
              &nbsp;/ {capacity} spots left
            </p>
          )}
          <p>{description}</p>
          <div className='flex items-center gap-2'>
            <span className='flex-none'>{guestCount.going} Going</span>
            {guestCount.maybe > 0 && <span className='flex-none'>{guestCount.maybe} Maybe</span>}
          </div>
          <div className='flex items-center gap-2'>
            {guests && Object.keys(guests).slice(0, 6).map((id) => {
              let guest = guests[id];
              let tooltip = {};
              return (
                <Tooltip content={guest.name ? guest.name : 'Attendee'} key={id}>
                  <Avatar showFallback name={guest.name} src={guest.avatar} />
                </Tooltip>
              );
            })}
            {(guestCount.total > 6) && <Avatar name={`+${guestCount.total - 6}`} />}
          </div>
        </div>
        <div className='flex-auto max-w-80 sm:max-w-96'>
          <img
            className='size-80 sm:size-96 object-cover'
            src={coverImage}
          />
          <div className='flex justify-around m-6' key='2j'>
            <IconButton id='going' label='Going' onPress={handleModalOpen}>👍</IconButton>
            <IconButton id='maybe' label='Maybe' onPress={handleModalOpen}>🤔</IconButton>
            <IconButton id='not going' label='Not Going' onPress={handleModalOpen}>👎</IconButton>
            <RSVPModal isOpen={isOpen} onOpenChange={onOpenChange} selected={rsvp} />
          </div>
        </div>
      </div>
    </div>
  );
}