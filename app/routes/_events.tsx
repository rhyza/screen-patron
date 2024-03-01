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
  const names = 'flex justify-center items-center rounded-full bg-default px-4 py-2 text-nowrap';

  const getClassName = ({ isActive }: {isActive: boolean}) => {
    return isActive ? cn(names, 'bg-gradiant') : names;
  }

  return (
    <div className='w-full p-6 flex justify-center'>
      <div className='max-w-[70rem]'>
        <div className='grid p-2 gap-4'>
          <div className='flex gap-2 max-sm:w-80 max-sm:text-small max-sm:overflow-x-auto'>
            <NavLink className={getClassName} end id='browse' to='/browse'>
              What's On
            </NavLink>
            <NavLink className={getClassName} end id='events' to='/events'>
              My Events
            </NavLink>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}