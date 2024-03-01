import { useEffect, useState } from 'react';
import { NavLink } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { cn } from '@nextui-org/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Screen Patron'},
    {name: 'description', content: 'DIY Film Screenings'},
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

  const renderBreakpoint = (breakpoint: string) => {
    return (
      <>
        <span className={`${breakpoint}:hidden`}><br/></span>
        <span className={`max-${breakpoint}:hidden`}>&nbsp;</span>
      </>
    );
  };

  const heroLinkClassName = cn(
    'bg-clip-text hover:text-transparent',
    'hover:bg-gradient-to-r hover:from-pink-500 hover:to-violet-500',
  );

  return (
    <div className='container overflow-clip overscroll-none py-10'>
      <h1
        className={cn(
          'absolute z-10 landscape:bottom-0 left-0 portrait:pt-8',
          'object-contain overflow-hidden bg-clip-text',
          'text-5xl sm:text-6xl md:text-7xl lg:text-9xl',
          'font-extrabold uppercase text-balance ',
          'selection:bg-fuchsia-300 selection:text-fuchsia-900'
        )}>
          <NavLink className={heroLinkClassName} to='events'>
            discover
          </NavLink>
          {renderBreakpoint('sm')}
          <span>local film screenings or show one</span>
          {renderBreakpoint('sm')}
          <NavLink className={heroLinkClassName} to='screening/create'>
            yourself
          </NavLink>
        </h1>
        <img
          className={cn(
            'absolute z-0 right-0 mix-blend-exclusion saturate-[.85]',
            'h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[40rem] p-8',
          )}
          src={srcMap[counter % srcMap.length]}
        />
    </div>
  );
}