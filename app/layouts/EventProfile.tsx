import { useState } from 'react';
import { NavLink } from '@remix-run/react';
import { Avatar, Button, Tooltip } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import {
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
  VideoCameraOutlineIcon,
} from '~/components/Icons';
import RSVPModal from '~/components/RSVPModal';

import type { JsonifiedEvent } from '~/models/event.server';
import type { HostInfo } from '~/models/host.server';
import type { GuestCount, RsvpInfo } from '~/models/rsvp.server';
import { getDateString, getTimeString, getLocalTimeZone } from '~/utils/format';
import { retypeNull } from '~/utils/validate';

type EventProfileProps = {
  actionData: number;
  event: JsonifiedEvent;
  hosts: HostInfo[];
  guests: RsvpInfo[];
  guestCount: {
    GOING: number;
    MAYBE: number;
    NOT_GOING: number;
    TOTAL_GUESTS: number;
    TOTAL_RESPONSES: number;
  };
  isHosting: boolean;
  rsvp: RsvpInfo | null;
};

/**
 * Layout for displaying an Event's name, description, poster, start date, end date,
 * location, cost, and venue capacity.
 * @param event JSONified Event object, e.g. dateStart is stored as a Date on the db but
 * gets transformed as a string when retrieved by a GET request.
 * @param modalContent String representing what content to feed the event page's modal
 * (RSVPModal).
 * * `rsvpForm` - Show the RSVP form
 * * `rsvpConfirmed` - Show the RSVP has updated message
 * * `signIn` - Show sign in form
 * * `signInConfirmed` - Show check your email message
 */
export default function EventProfile({
  actionData,
  event: {
    id,
    name,
    photo,
    dateStart,
    dateEnd,
    timeZone,
    location,
    cost,
    capacity,
    description,
  },
  hosts,
  guests,
  guestCount,
  isHosting,
  rsvp,
}: EventProfileProps) {
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;

  return (
    <div className="flex flex-wrap-reverse gap-6 justify-center">
      <div className="flex-auto space-y-4 min-w-[300px] max-w-xl ">
        <div className="flex items-center gap-6">
          <h1 className="text-5xl font-medium">{name}</h1>
          {isHosting && (
            <Button as={NavLink} to="./edit" radius="none">
              Edit
            </Button>
          )}
        </div>
        {start ? (
          <DateRange start={start} end={end} timeZone={timeZone} />
        ) : (
          <p className="text-2xl font-medium">Date & Time TBD</p>
        )}
        <ShareLinks eventId={id || ''} />
        <InfoField
          icon={<VideoCameraOutlineIcon />}
          text={
            <div className="flex items-center gap-2">
              Presented by <Avatar showFallback src={retypeNull(hosts[0].user.photo)} />{' '}
              <NavLink to={`/user/${hosts[0].userId}`}>
                {retypeNull(hosts[0].name, hosts[0].user.name) || 'Anonymous Filmmaker'}
              </NavLink>
            </div>
          }
        />
        <InfoField icon={<MapPinIcon />} text={location || 'Location TBD'} />
        {cost != undefined && (
          <InfoField icon={<TicketIcon />} text={cost > 0 ? `$${cost} per person` : 'Free'} />
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
        {!isHosting && <RSVPModal actionData={actionData} rsvp={rsvp} />}
      </div>
    </div>
  );
}

function DateRange({
  start,
  end,
  timeZone,
}: {
  start: Date;
  end?: Date | null;
  timeZone?: string | null;
}) {
  const includeTimeZone = timeZone ? timeZone != getLocalTimeZone() : false;
  const omitSameYear = end ? end.getFullYear() === start.getFullYear() : true;

  const startDate = getDateString({
    date: start,
    omitSameYear,
  });

  let startTime = end
    ? getTimeString({ date: start, timeZone })
    : getTimeString({ date: start, timeZone, includeTimeZone });

  if (end) {
    const endDate = getDateString({ date: end, omitSameYear: true, timeZone });
    const endTime = getTimeString({ date: end, timeZone, includeTimeZone });

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
        {guests
          .filter((guest) => guest.status != 'NOT_GOING')
          .map((guest, index) => {
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

function ShareLinks({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Screen Patron',
        text: 'Check out this event!',
        url: `http://localhost:3000/e/${eventId}`,
      });
    } catch (err) {
      navigator.clipboard.writeText(`http://localhost:3000/e/${eventId}`);
      setIsOpen(() => true);
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <Tooltip
        closeDelay={1000}
        content={'Link copied!'}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
      >
        <Button className="btn-link" onPress={handleShare}>
          share event
        </Button>
      </Tooltip>
    </div>
  );
}
