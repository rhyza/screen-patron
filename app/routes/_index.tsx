import { useEffect, useState } from 'react';
import { NavLink } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { cn } from '@nextui-org/react';

import { heroImages } from '~/assets';

export const meta: MetaFunction = () => {
  return [{ title: 'Screen Patron' }, { name: 'description', content: 'DIY Film Events' }];
};

/**
 * `/` — Landing Page
 */
export default function LandingPage() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="container overflow-clip overscroll-none py-10">
      <div className="absolute z-10 bottom-0 left-0 text-balance lg:pr-12">
        <h1
          className={cn(
            'landscape:text-5xl sm:landscape:text-6xl md:landscape:text-7xl',
            'text-6xl sm:portrait:text-8xl md:portrait:text-8xl',
            'lg:landscape:text-8xl xl:landscape:text-9xl 2xl:landscape:text-[10rem]',
            'lg:portrait:text-9xl xl:portrait:text-[10rem] 2xl:portrait:text-[12rem]',
            'min-[2000px]:landscape:text-[12rem] min-[2600px]:landscape:text-[14rem]',
            'min-[2000px]:portrait:text-[14rem] min-[2600px]:portrait:text-[16rem]',
            'min-[2800px]:landscape:text-[16rem] min-[3400px]:landscape:text-[18rem]',
            'min-[2800px]:portrait:text-[18rem] min-[3400px]:portrait:text-[20rem]',
            'font-extrabold uppercase',
            'selection:bg-fuchsia-300 selection:text-fuchsia-900',
          )}
        >
          <NavLink className="hover:text-gradient" to="browse">
            discover
          </NavLink>
          <span> local film events or put on </span>
          <NavLink className="hover:text-gradient" to="create">
            your own
          </NavLink>
        </h1>
      </div>
      <div
        className={cn(
          'absolute z-0',
          'landscape:bottom-1/4 landscape:right-0 min-[2000px]:landscape:left-1/2',
          'portrait:top-0 portrait:inset-0 portrait:grid portrait:place-content-center',
        )}
      >
        {heroImages.map((src, i) => (
          <img
            alt="People making films and attending film screenings"
            className={cn(
              'h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[40rem] xl:h-[45rem] 2xl:h-[50rem]',
              'min-[2000px]:h-[55rem] min-[2600px]:h-[60rem]',
              'min-[2800px]:h-[65rem] min-[3400px]:h-[80rem]',
              'portrait:h-[85svh]',
              'object-contain p-8 saturate-[.85]',
              counter % heroImages.length === i ? '' : 'hidden',
            )}
            key={i}
            src={src}
          />
        ))}
      </div>
    </div>
  );
}
