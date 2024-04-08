import { useState } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Button, Card, Popover, PopoverContent, PopoverTrigger, cn } from '@nextui-org/react';

import { ButtonTabs, ButtonTab } from './ButtonTabs';
import { CalendarIcon } from './Icons';

import { getDateInputString, getDateString, getFutureDate } from '~/utils/format';

export default function DatePicker() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState('All Dates');

  const dateOptions = {
    omitSameYear: true,
    fullWeekDay: true,
    fullMonth: true,
  };
  const today = getFutureDate(0);
  const tomorrow = getFutureDate(1);
  const oneWeek = getFutureDate(6);
  const todayString = getDateString({ date: today, ...dateOptions });
  const tomorrowString = getDateString({ date: tomorrow, ...dateOptions });
  const oneWeekString = getDateString({ date: oneWeek, ...dateOptions });
  const todayParamString = getDateInputString(today, undefined, true);
  const tomorrowParamString = getDateInputString(tomorrow, undefined, true);
  const oneWeekParamString = getDateInputString(oneWeek, undefined, true);

  const setContent = (id: string) => {
    if (id === 'today') {
      setSearchParams((prev) => {
        setRange(todayString);
        prev.set('dateMax', todayParamString);
        return prev;
      });
    } else if (id === 'tomorrow') {
      setRange(tomorrowString);
      setSearchParams((prev) => {
        prev.set('dateMin', tomorrowParamString);
        prev.set('dateMax', tomorrowParamString);
        return prev;
      });
    } else if (id === 'this-week') {
      setRange(`${todayString} — ${oneWeekString}`);
      setSearchParams((prev) => {
        prev.set('dateMin', todayParamString);
        prev.set('dateMax', oneWeekParamString);
        return prev;
      });
    } else {
      setRange('All Dates');
      setSearchParams((prev) => {
        prev.delete('dateMin');
        prev.delete('dateMax');
        return prev;
      });
    }
  };

  return (
    <Popover backdrop="opaque" offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          className={cn('max-md:isIconOnly', range != 'All Dates' && 'bg-invert')}
          radius="full"
          startContent={<CalendarIcon />}
        >
          <span className="max-md:hidden">Date</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none">
        <ButtonTabs className="p-2" isDeselectable setTabContent={setContent}>
          <ButtonTab id="today">Today</ButtonTab>
          <ButtonTab id="tomorrow">Tomorrow</ButtonTab>
          <ButtonTab id="this-week">This Week</ButtonTab>
        </ButtonTabs>
        <Card className="w-[18.5rem] bg-invert p-4" radius="sm">
          <span className="text-center text-small font-medium">{range}</span>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
