import { useState } from 'react';
import { Button, Card, Popover, PopoverContent, PopoverTrigger, cn } from '@nextui-org/react';

import { ButtonTabs, ButtonTab } from './ButtonTabs';
import { CalendarIcon } from './Icons';

import { getDateString, getFutureDate } from '~/utils/format';

export default function DatePicker() {
  const [range, setRange] = useState('All Dates');
  const setContent = (id: string) => {
    const dateOptions = {
      omitSameYear: true,
      fullWeekDay: true,
      fullMonth: true,
    };
    const todayString = getDateString({ date: getFutureDate(0), ...dateOptions });
    const tomorrowString = getDateString({ date: getFutureDate(1), ...dateOptions });
    const oneWeekString = getDateString({ date: getFutureDate(6), ...dateOptions });

    if (id === 'today') {
      setRange(todayString);
    } else if (id === 'tomorrow') {
      setRange(tomorrowString);
    } else if (id === 'this-week') {
      setRange(`${todayString} — ${oneWeekString}`);
    } else {
      setRange('All Dates');
    }
  };

  return (
    <Popover backdrop="opaque" offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          className={cn(
            'max-md:px-unit-0 max-md:min-w-unit-10',
            range != 'All Dates' ? 'bg-foreground text-background' : '',
          )}
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
        <Card className="w-[18.5rem] p-4 bg-foreground text-background" radius="sm">
          <span className="text-center text-small font-medium">{range}</span>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
