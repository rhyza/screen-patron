import { NavLink, Outlet } from '@remix-run/react';
import { cn } from '@nextui-org/react';

export default function Events() {
  const getClassName = ({ isActive }: { isActive: boolean }) => {
    return cn(
      'flex justify-center items-center rounded-full bg-default px-4 py-2 text-nowrap',
      isActive ? 'bg-gradiant' : '',
    );
  };

  return (
    <div className="w-full p-6 flex justify-center">
      <div className="max-w-[70rem]">
        <div className="grid p-2 gap-4">
          <div className="flex gap-2 max-sm:w-80 max-sm:text-small max-sm:overflow-x-auto">
            <NavLink className={getClassName} end id="browse" to="/browse">
              What&aposs On
            </NavLink>
            <NavLink className={getClassName} end id="events" to="/events">
              My Events
            </NavLink>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
