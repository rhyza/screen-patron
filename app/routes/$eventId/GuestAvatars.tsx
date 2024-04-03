import { Avatar, Tooltip } from '@nextui-org/react';

import type { GuestCount, RsvpInfo } from '~/models/rsvp.server';
import { retypeNull } from '~/utils/validate';

/**
 * Renders a group of Avatars of User's that have responded "GOING" or "MAYBE" along with the
 * number of each response.
 * @param guests An array of all RSVP objects for the Event
 * @param guestCount A tally of each RSVP response
 */
export default function GuestAvatars({
  guests,
  guestCount,
}: {
  guests: RsvpInfo[];
  guestCount: GuestCount;
}) {
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
