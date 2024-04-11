import { useState } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Button, Card, Popover, PopoverContent, PopoverTrigger, cn } from '@nextui-org/react';

import { ButtonTabs, ButtonTab } from './ButtonTabs';
import { CalendarIcon } from './Icons';

import { getDateString, getDateSearchString, getFutureDate } from '~/utils/format';

export default function DatePicker() {
  const [tab, setTab] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateMin, dateMax] = [searchParams.get('dateMin'), searchParams.get('dateMax')];

  const today = getFutureDate(0);
  const tomorrow = getFutureDate(1);
  const oneWeek = getFutureDate(6);
  const dateOptions = {
    omitSameYear: true,
    fullWeekDay: true,
    fullMonth: false,
    timeZone: 'UTC',
  };

  const setContent = (id: string) => {
    if (id === 'today') {
      setSearchParams((prev) => {
        prev.set('dateMin', getDateSearchString(today, undefined, true));
        prev.set('dateMax', getDateSearchString(today, undefined, false));
        return prev;
      });
    } else if (id === 'tomorrow') {
      setSearchParams((prev) => {
        prev.set('dateMin', getDateSearchString(tomorrow, undefined, true));
        prev.set('dateMax', getDateSearchString(tomorrow, undefined, false));
        return prev;
      });
    } else if (id === 'this-week') {
      setSearchParams((prev) => {
        prev.set('dateMin', getDateSearchString(today, undefined, true));
        prev.set('dateMax', getDateSearchString(oneWeek, undefined, false));
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete('dateMin');
        prev.delete('dateMax');
        return prev;
      });
    }
  };

  const clearContent = () => {
    setTab(() => 'all');
    setContent('all');
  };

  const todayString = getDateString({ date: today, ...dateOptions, timeZone: undefined });
  const getRangeString = () => {
    if (!dateMin && !dateMax) return 'All Dates';

    const min = dateMin?.slice(0, 10);
    const max = dateMax?.slice(0, 10);
    const minString = min ? getDateString({ date: new Date(min), ...dateOptions }) : '';
    const maxString = max ? getDateString({ date: new Date(max), ...dateOptions }) : '';
    let rangeString = min ? minString : maxString;

    if (min && max && min != max) {
      rangeString += ` — ${maxString}`;
    } else if (!max && min != todayString) {
      rangeString += ' and later';
    } else if (!min && max != todayString) {
      rangeString += ' and earlier';
    }

    return rangeString;
  };

  return (
    <Popover backdrop="opaque" offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          className={cn('max-md:isIconOnly', (dateMin || dateMax) && 'bg-invert')}
          radius="full"
          startContent={<CalendarIcon />}
        >
          <span className="max-md:hidden">Date</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none flex gap-2">
        <ButtonTabs isDeselectable onTabChange={setTab} setTabContent={setContent} tab={tab}>
          <ButtonTab id="today">Today</ButtonTab>
          <ButtonTab id="tomorrow">Tomorrow</ButtonTab>
          <ButtonTab id="this-week">This Week</ButtonTab>
        </ButtonTabs>
        <Card className="w-[18.5rem] bg-invert p-4" radius="sm">
          <span className="text-center text-small font-medium">{getRangeString()}</span>
        </Card>
        <Button className="bg-invert" onPress={clearContent} radius="full">
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}
