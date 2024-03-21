import { LoaderFunctionArgs, json } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { cn } from '@nextui-org/react';

import { getSession, getSupabaseServerClient } from '~/db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  return json({ session });
};

export default function EventPages() {
  const { session } = useLoaderData<typeof loader>();
  const getClassName = ({ isActive }: { isActive: boolean }) => {
    return cn(
      'flex justify-center items-center rounded-full bg-default px-4 py-2 text-nowrap',
      isActive ? 'bg-gradient' : '',
    );
  };

  return (
    <div className="w-full p-6 flex justify-center">
      <div className="max-w-[70rem]">
        <div className="grid p-2 gap-4">
          <div className="flex gap-2 max-sm:w-80 max-sm:text-small max-sm:overflow-x-auto">
            <NavLink className={getClassName} end id="browse" to="/browse">
              What's On
            </NavLink>
            {session && (
              <NavLink className={getClassName} end id="events" to="/events">
                My Events
              </NavLink>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
