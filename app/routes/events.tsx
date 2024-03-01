import type { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';
import { cn } from '@nextui-org/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ];
};

export default function Events() {
  const getClassName = ({ isActive }: {isActive: boolean}) => {
    const names = 'flex justify-center items-center rounded-full bg-default px-4 py-2 text-nowrap';
    return isActive ? cn(names, 'bg-gradiant') : names;
  }

  return (
    <div className='w-full p-6 flex justify-center'>
      <div className='max-w-[70rem]'>
        <div className='grid px-2 pb-6'>
          <div className='flex gap-2 overflow-x-auto'>
            <NavLink className={getClassName} end id='browse' to='/events'>
              What's On
            </NavLink>
            <NavLink className={getClassName} end id='upcoming' to='/events/upcoming'>
              Upcoming
            </NavLink>
            <NavLink className={getClassName} end id='hosting' to='/events/hosting'>
              Hosting
            </NavLink>
            <NavLink className={getClassName} end id='attended' to='/events/past'>
              Attended
            </NavLink>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}