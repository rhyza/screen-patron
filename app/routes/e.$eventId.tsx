import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Avatar, Button, Link, Tooltip, useDisclosure } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import IconButton from '~/components/IconButton';
import { MapPinIcon, StarIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';
import RSVPModal from '~/components/RSVPModal';
import { Event, countGuests, getEvent } from '~/models/event.server';
import { getHosts } from '~/models/host.server';
import { getGuests } from '~/models/rsvp.server';
import { getDateString, getTimeString, invariant, retypeNull } from '~/utils';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const event: Partial<Event> | null = await getEvent(params.eventId);
  const hosts = await getHosts(params.eventId);
  const guests = await getGuests(params.eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ event, hosts, guests });
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
  const {
    event: { name, photo, dateStart, dateEnd, location, cost, capacity, description },
    hosts,
    guests,
  } = useLoaderData<typeof loader>();
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;
  const guestCount = countGuests(guests);
  const host = Object.values(hosts)[0]; // change to allow multiple hosts

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rsvp, setRsvp] = useState('');
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setRsvp(() => id);
    onOpen();
  };

  const renderInfoField = (icon: JSX.Element, text: string | JSX.Element) => {
    return (
      <div className="flex items-center gap-2">
        <span className="flex-none">{icon}</span>
        <span className="flex-initial">{text}</span>
      </div>
    );
  };

  const renderDateRange = (start: Date, end?: Date) => {
    let startDate = getDateString({
      date: start,
      omitSameYear: !(end && end.getFullYear() != start.getFullYear()),
    });
    let startTime = getTimeString({ date: start });

    if (end) {
      const endDate = getDateString({ date: end, omitSameYear: true });
      const endTime = getTimeString({ date: end });

      if (end.getDate() === start.getDate()) {
        startTime += ` — ${endTime}`;
      } else {
        return (
          <div>
            <p className="text-2xl">{startDate + ' · ' + startTime + ' — '}</p>
            <p className="text-2xl">{endDate + ' · ' + endTime}</p>
          </div>
        );
      }
    }

    return (
      <div>
        <p className="text-3xl font-medium">{startDate}</p>
        <p className="text-xl font-medium text-neutral-600">{startTime}</p>
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-wrap-reverse gap-6 justify-center">
        <div className="flex-auto space-y-4 min-w-[300px] max-w-xl ">
          <div className="flex items-center gap-6">
            <h1 className="text-5xl font-medium">{name}</h1>
            {isUser && (
              <Button as={NavLink} to="./edit" radius="none">
                Edit
              </Button>
            )}
          </div>
          {start ? (
            renderDateRange(start, end)
          ) : (
            <p className="text-2xl font-medium">Date & Time TBD</p>
          )}
          {(isUser || isGuest) && (
            <div className="flex gap-6 items-center">
              <Link className="btn-link mb-2" onPress={() => alert('share options')}>
                share
              </Link>
              <Link className="btn-link mb-2" isExternal href="https://calendar.google.com/">
                add to calendar
              </Link>
            </div>
          )}

          {renderInfoField(
            <StarIcon />,
            <div className="flex items-center gap-2">
              Hosted by <Avatar showFallback src={retypeNull(host.user.photo)} />{' '}
              {retypeNull(host.name, 'Anonymous Filmmaker')}
            </div>,
          )}
          {renderInfoField(<MapPinIcon />, location || 'Location TBD')}
          {cost != undefined &&
            renderInfoField(<TicketIcon />, cost > 0 ? `$${cost} per person` : 'Free')}
          {capacity &&
            renderInfoField(
              <UserGroupIcon />,
              <p>
                <span className="text-primary">{capacity - guestCount.GOING}</span>
                &nbsp;/ {capacity} spots left
              </p>,
            )}
          <p>{description}</p>
          <div className="flex items-center gap-2">
            <span className="flex-none">{guestCount.GOING} Going</span>
            {guestCount.MAYBE && <span className="flex-none">{guestCount.MAYBE} Maybe</span>}
          </div>
          <div className="flex items-center gap-2">
            {guests.map((guest, index) => {
              return (
                <Tooltip
                  content={retypeNull(guest.name, guest.user.name) || 'Attendee'}
                  key={index}
                >
                  <Avatar
                    showFallback
                    name={retypeNull(guest.name, guest.user.name) || 'Attendee'}
                    src={retypeNull(guest.user.photo)}
                  />
                </Tooltip>
              );
            })}
            {guestCount.TOTAL_GUESTS > 6 && (
              <Avatar name={`+${guestCount.TOTAL_GUESTS - 6}`} />
            )}
          </div>
        </div>
        <div className="flex-auto max-w-80 sm:max-w-96">
          <img
            className="size-80 sm:size-96 object-cover"
            src={photo || eventPlaceholderImage}
          />
          <div className="flex justify-around m-6">
            <IconButton id="going" label="Going" onPress={handleModalOpen}>
              👍
            </IconButton>
            <IconButton id="maybe" label="Maybe" onPress={handleModalOpen}>
              🤔
            </IconButton>
            <IconButton id="not going" label="Can't Go" onPress={handleModalOpen}>
              😢
            </IconButton>
            <RSVPModal isOpen={isOpen} onOpenChange={onOpenChange} selected={rsvp} />
          </div>
        </div>
      </div>
    </div>
  );
}
