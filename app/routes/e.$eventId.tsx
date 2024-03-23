import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Avatar, Button, Link, Tooltip, useDisclosure } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import IconButton from '~/components/IconButton';
import { MapPinIcon, StarIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';
import RSVPModal from '~/components/RSVPModal';
import { getSession, getSupabaseServerClient } from '~/db.server';
import type { Event } from '~/models/event.server';
import { getEvent } from '~/models/event.server';
import { getHosts, isHost } from '~/models/host.server';
import type { GuestCount, RsvpInfo } from '~/models/rsvp.server';
import { countGuests, getGuest, getGuests } from '~/models/rsvp.server';
import { getDateString, getTimeString, invariant, retypeNull } from '~/utils';

export const meta: MetaFunction = () => {
  return [{ title: 'Screen Patron' }, { name: 'description', content: 'DIY Film Events' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const event: Partial<Event> | null = await getEvent(params.eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const hosts = await getHosts(params.eventId);
  const guests = await getGuests(params.eventId);
  const guestCount = countGuests(guests);

  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  const isUser = session?.user?.id ? await isHost(params.eventId, session.user.id) : false;
  const rsvp = session?.user?.id ? await getGuest(params.eventId, session.user.id) : null;

  return json({ event, hosts, guests, guestCount, isUser, rsvp });
};

/**
 * `/e/$eventId` — Page displaying an Event's details and where Users can RSVP.
 */
export default function EventPage() {
  const {
    event: { name, photo, dateStart, dateEnd, location, cost, capacity, description },
    hosts,
    guests,
    guestCount,
    isUser,
    rsvp,
  } = useLoaderData<typeof loader>();
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;

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
            <DateRange start={start} end={end} />
          ) : (
            <p className="text-2xl font-medium">Date & Time TBD</p>
          )}
          {(isUser || rsvp) && <ShareLinks />}
          <InfoField
            icon={<StarIcon />}
            text={
              <div className="flex items-center gap-2">
                Hosted by <Avatar showFallback src={retypeNull(hosts[0].user.photo)} />{' '}
                <NavLink to={`/user/${hosts[0].userId}`}>
                  {retypeNull(hosts[0].name, hosts[0].user.name) || 'Anonymous Filmmaker'}
                </NavLink>
              </div>
            }
          />
          <InfoField icon={<MapPinIcon />} text={location || 'Location TBD'} />
          {cost != undefined && (
            <InfoField
              icon={<TicketIcon />}
              text={cost > 0 ? `$${cost} per person` : 'Free'}
            />
          )}
          {capacity != undefined && capacity > 0 && (
            <InfoField
              icon={<UserGroupIcon />}
              text={
                <p>
                  <span className="text-primary">{capacity - guestCount.GOING}</span>
                  &nbsp;/ {capacity} spots left
                </p>
              }
            />
          )}
          {description && <p>{description}</p>}
          <Guests guests={guests} guestCount={guestCount} />
        </div>
        <div className="flex-auto max-w-80 sm:max-w-96">
          <img
            alt={`Event poster for ${name}`}
            className="size-80 sm:size-96 object-cover"
            src={photo || eventPlaceholderImage}
          />
          {!isUser && <RsvpForm response={rsvp?.status} />}
        </div>
      </div>
    </div>
  );
}

function DateRange({ start, end }: { start: Date; end?: Date }) {
  const startDate = getDateString({
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
}

function Guests({ guests, guestCount }: { guests: RsvpInfo[]; guestCount: GuestCount }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="flex-none">{guestCount.GOING} Going</span>
        {guestCount.MAYBE > 0 && <span className="flex-none">{guestCount.MAYBE} Maybe</span>}
      </div>
      <div className="flex items-center gap-2">
        {guests.map((guest, index) => {
          return (
            <Tooltip
              content={retypeNull(guest.name, guest.user.name) || 'Attendee'}
              key={index}
            >
              <Avatar showFallback src={retypeNull(guest.user.photo)} />
            </Tooltip>
          );
        })}
        {guestCount.TOTAL_GUESTS > 6 && <Avatar name={`+${guestCount.TOTAL_GUESTS - 6}`} />}
      </div>
    </>
  );
}

function InfoField({ icon, text }: { icon: JSX.Element; text: JSX.Element | string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-none">{icon}</span>
      <span className="flex-initial">{text}</span>
    </div>
  );
}

function RsvpForm({ response = '' }: { response: string | undefined }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rsvp, setRsvp] = useState(response);
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setRsvp(() => id);
    onOpen();
  };

  const options = [
    { id: 'GOING', label: 'Going', icon: '👍' },
    { id: 'MAYBE', label: 'Maybe', icon: '🤔' },
    { id: 'NOT_GOING', label: `Can't Go`, icon: '😢' },
  ];

  return (
    <div className="flex justify-around m-6">
      {options.map((option) => (
        <IconButton
          id={option.id}
          key={option.id}
          isHidden={response != '' && response != option.id}
          isSelected={response != '' && response === option.id}
          label={option.label}
          onPress={handleModalOpen}
        >
          {option.icon}
        </IconButton>
      ))}
      <RSVPModal isOpen={isOpen} onOpenChange={onOpenChange} selected={rsvp} />
    </div>
  );
}

function ShareLinks() {
  return (
    <div className="flex gap-6 items-center">
      <Link className="btn-link mb-2" onPress={() => alert('share options')}>
        share
      </Link>
      <Link className="btn-link mb-2" isExternal href="https://calendar.google.com/">
        add to calendar
      </Link>
    </div>
  );
}
