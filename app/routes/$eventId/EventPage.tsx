import { NavLink } from '@remix-run/react';
import { Avatar, Button, Image } from '@nextui-org/react';

import GuestAvatars from './GuestAvatars';
import ShareLinks from './ShareLinks';
import { eventPlaceholderImage } from '~/assets';
import {
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
  VideoCameraOutlineIcon,
} from '~/components/Icons';
import RSVPModal from '~/components/RSVP';

import type { JsonifiedEvent } from '~/models/event.server';
import type { HostInfo } from '~/models/host.server';
import type { RsvpInfo } from '~/models/rsvp.server';
import { getDateString, getTimeString, getLocalTimeZone } from '~/utils/format';
import { retypeNull } from '~/utils/validate';

type EventProfileProps = {
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
 * Template for displaying an Event's name, description, poster, start date, end date,
 * location, cost, and venue capacity.
 * @param event JSONified Event object, e.g. dateStart is stored as a Date on the db but
 * gets transformed as a string when retrieved by a GET request.
 * @param hosts An array of hosts for the event
 * @param guests An array of RSVPs for the event
 * @param guestCount A tally of the different RSVP responses
 * @param isHosting Booleann for is the current user hosting this event?
 * @param rsvp The current user's RSVP info
 */
export default function EventPage({
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
          <h1 className="text-5xl sm:text-6xl font-medium">{name}</h1>
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
        {guestCount.TOTAL_GUESTS > 0 && (
          <GuestAvatars guests={guests} guestCount={guestCount} />
        )}
      </div>
      <div className="flex-auto max-w-80 sm:max-w-96">
        <Image
          alt={`Event poster for ${name}`}
          className="rounded-[10px] size-80 sm:size-96 object-cover"
          src={photo || eventPlaceholderImage}
        />
        {!isHosting && <RSVPModal rsvp={rsvp} />}
      </div>
    </div>
  );
}

/**
 * Renders a formatted and stylized date range according to the following format:
 * * The day of week, the starting time / month / date, and ending time (if given) always
 * renders.
 * * The year is omitted unless either date's year is different than the current year.
 * * The timezone is omitted unless it is different than the user's system default timezone.
 * * The ending month / date is omitted unless it is different than the start date.
 * @param start The Event's start date and time
 * @param end (optional) The Event's end date and time
 * @param timeZone (optional) The timezone to use to calculate the times to display, defaults
 * to the user's system default timezone
 */
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

/**
 * Renders an icon followed by a line of text for displaying info.
 */
function InfoField({ icon, text }: { icon: JSX.Element; text: JSX.Element | string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-none">{icon}</span>
      <span className="flex-initial">{text}</span>
    </div>
  );
}
