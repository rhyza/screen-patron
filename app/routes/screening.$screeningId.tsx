import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
import { Avatar, Button, Link } from '@nextui-org/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';
import { getDateString, getTimeString } from '~/utils';
import { getScreening } from '~/services/screening';

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const screening = await getScreening(params.screeningId);
	if (!screening) {
		throw new Response('Not Found', {status: 404});
	}
	return json({ screening });
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
}

export default function Screening() {
  const { screening } = useLoaderData<typeof loader>();
  const {
    name,
    coverImage = 'https://placehold.co/800?text=Poster&font=roboto',
    dateStart,
    dateEnd,
    location = 'Location TBD',
    cost = 0,
    capacity = 100,
    description,
    guests,
  } = screening;
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;
  const guestsGoing = guests ? guests.filter((guest) => guest.status === 'going') : undefined;
  const guestsMaybe = guests ? guests.filter((guest) => guest.status === 'maybe') : undefined;
  const going = guestsGoing ? guestsGoing.length : 0;
  const maybe = guestsMaybe ? guestsMaybe.length : 0;
  const totalGuests = going + maybe;

  const infoField = (icon: JSX.Element, text: string | JSX.Element) => {
    return (
      <div className='flex items-center gap-2'>
        <span className='flex-none'>{icon}</span>
        <span className='flex-initial'>{text}</span>
      </div>
    );
  };

  const rsvpButton = (icon: string | JSX.Element, label?: string) => {
    return (
      <div className='flex flex-wrap justify-center w-24 sm:w-28'>
        <Button className='text-4xl sm:text-5xl w-fit h-fit p-4' isIconOnly radius='full'>
          {icon}
        </Button>
        <p>{label}</p>
      </div>
    );
  };

  const dateRange = (start: Date, end?: Date) => {
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
            ? dateRange(start, end)
            : <p className='text-2xl font-medium'>Date & Time TBD</p>
          }
          {(isUser || isGuest) &&
            <div className='flex gap-6 items-center'>
              <Link className='btn-link mb-2' onClick={() => alert('share options')}>
                share
              </Link>
              <Link className='btn-link mb-2' isExternal href='https://calendar.google.com/'>
                add to calendar
              </Link>
            </div>
          }
          {infoField(<MapPinIcon />, location)}
          {cost != undefined && infoField(
            <TicketIcon />, cost > 0 ? `$${cost} per person`: 'Free'
          )}
          {capacity && infoField(
            <UserGroupIcon />, 
            <p><span className='text-accent'>{capacity - totalGuests}</span> / {capacity} spots left</p>
          )}
          <p>{description}</p>
          <div className='flex items-center gap-2'>
            <span className='flex-none'>{going} Going</span>
            {maybe > 0 && <span className='flex-none'>{maybe} Maybe</span>}
          </div>
          <div className='flex items-center gap-2'>
            {guests && guests.slice(0, 6).map((guest) => (
              <Avatar showFallback key={guest.guestId} src={guest.avatar} />
            ))}
            {(totalGuests > 6) && <Avatar name={`+${totalGuests - 6}`} />}
          </div>
        </div>
        <div className='flex-auto max-w-80 sm:max-w-96'>
          <img
            className='size-80 sm:size-96 object-cover'
            src={coverImage}
          />
          <div className='flex justify-around m-6'>
            {rsvpButton('👍', 'Going')}
            {rsvpButton('🤔', 'Maybe')}
            {rsvpButton('👎', 'Not Going')}
          </div>
        </div>
      </div>
    </div>
  );
}