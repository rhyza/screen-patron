import { useEffect, useState } from 'react';
import { NavLink } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { cn } from '@nextui-org/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Screen Patron'},
    {name: 'description', content: 'DIY Film Events'},
  ];
};

export default function Index() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
      console.log(counter);
    }, 1500);
    return () => clearInterval(interval);
  }, [counter]);

  const srcMap = [
    'https://images.unsplash.com/photo-1625503650421-e1561cf432cf',
    'https://images.unsplash.com/photo-1542509058-f39fe2575189',
    'https://images.unsplash.com/photo-1532800783378-1bed60adaf58',
    'https://images.unsplash.com/photo-1621544271296-8384d27ec046',
    'https://images.unsplash.com/photo-1541362762083-cbf93d30defa',
    'https://images.unsplash.com/photo-1588823400943-b85ba1a6d19a',
    'https://images.unsplash.com/photo-1632094623687-5643447fadcc',
    'https://images.unsplash.com/photo-1568720888838-51fd77a98242',
    'https://images.unsplash.com/photo-1552417559-f62e53cba705',
    'https://images.unsplash.com/photo-1605958610903-43aa1dfc9697',
    'https://images.unsplash.com/photo-1574622731854-f06af7345d28',
  ];

  const heroLinkClassName = cn(
    'bg-clip-text hover:text-transparent',
    'hover:bg-gradient-to-r hover:from-pink-500 hover:to-violet-500',
  );

  return (
    <div className='container overflow-clip overscroll-none py-10'>
        <div
          className={cn(
            'absolute z-10 landscape:bottom-0 left-0 text-balance',
            'portrait:top-1/4',
            'lg:pr-12'
          )}
        >
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
              'selection:bg-fuchsia-300 selection:text-fuchsia-900'
            )}
          >
            <NavLink className={heroLinkClassName} to='browse'>
              discover
            </NavLink>
            <span> local film events or put on </span>
            <NavLink className={heroLinkClassName} to='e/create'>
              your own
            </NavLink>
          </h1>
        </div>
        <div
          className={cn(
            'absolute z-0 landscape:bottom-1/4 right-0',
            'portrait:top-0',
            'min-[2000px]:left-1/2',
          )}
        >
          <img
            className={cn(
              'h-[20rem] sm:h-[30rem] md:h-[35rem]',
              'lg:h-[40rem] xl:h-[45rem] 2xl:h-[50rem]',
              'min-[2000px]:h-[55rem] min-[2600px]:h-[60rem]',
              'min-[2800px]:h-[65rem] min-[3400px]:h-[80rem]',
              'object-contain p-8 saturate-[.85]',
            )}
            src={srcMap[counter % srcMap.length]}
          />
        </div>
    </div>
  );
}
