import { useState } from 'react';
import { Button, Card, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { ButtonTabs, ButtonTab } from './ButtonTabs';
import { CalendarIcon } from './Icons';

import { getDateString } from '~/utils/format';

export default function DatePicker() {
  const dateOptions = {
    omitSameYear: true,
    fullWeekDay: true,
    fullMonth: true,
  };
  const today = new Date(Date.now());
  const tomorrow = new Date(Date.now() + 3600 * 1000 * 24 * 1);
  const oneWeek = new Date(Date.now() + 3600 * 1000 * 24 * 6);

  const [range, setRange] = useState('All Dates');
  const setContent = (id: string) => {
    const todayString = getDateString({ date: today, ...dateOptions });
    const tomorrowString = getDateString({ date: tomorrow, ...dateOptions });
    const oneWeekString = getDateString({ date: oneWeek, ...dateOptions });

    if (id === 'today') {
      setRange(todayString);
    } else if (id === 'tomorrow') {
      setRange(tomorrowString);
    } else {
      setRange(`${todayString} — ${oneWeekString}`);
    }
  };

  return (
    <Popover backdrop="opaque" offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          className="max-md:px-unit-0 max-md:min-w-unit-10"
          radius="full"
          startContent={<CalendarIcon />}
        >
          <span className="max-md:hidden">Date</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none">
        <ButtonTabs className="p-2" setTabContent={setContent}>
          <ButtonTab id="today">Today</ButtonTab>
          <ButtonTab id="tomorrow">Tomorrow</ButtonTab>
          <ButtonTab id="this-week">This Week</ButtonTab>
        </ButtonTabs>
        <Card className="w-[18.5rem] p-4 bg-foreground text-background" radius="sm">
          <span className="text-center text-small font-medium">{range}</span>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
