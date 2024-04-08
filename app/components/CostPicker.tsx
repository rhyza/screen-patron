import { useState } from 'react';
import { useSearchParams } from '@remix-run/react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  cn,
} from '@nextui-org/react';

import { DollarIcon } from './Icons';

export default function CostPicker() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<number[]>([0, 100]);
  const handleChange = (input: number[]) => {
    setRange(input);
    setSearchParams((prev) => {
      if (input[0] > 0) {
        prev.set('costMin', input[0].toString());
      } else {
        prev.delete('costMin');
      }
      if (input[1] < 100) {
        prev.set('costMax', input[1].toString());
      } else {
        prev.delete('costMax');
      }
      return prev;
    });
  };

  const [min, max] = range;
  const getRangeString = () => {
    if (!min && !max) {
      return 'Free Only';
    } else if (!min && max === 100) {
      return 'No Limits';
    } else {
      const minString = min ? `$${min}` : 'Free';
      const maxString = max < 100 ? `$${max}` : 'Any';
      return minString + ' — ' + maxString;
    }
  };

  return (
    <Popover backdrop="opaque" offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          className={cn('max-md:isIconOnly', (min || max < 100) && 'bg-invert')}
          radius="full"
          startContent={<DollarIcon />}
        >
          <span className="max-md:hidden">Cost</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[18.5rem] bg-invert py-4 px-6">
        <Slider
          arai-label="Price Range"
          step={1}
          minValue={0}
          maxValue={100}
          value={range}
          onChange={(input) => typeof input != 'number' && handleChange(input)}
          className="max-w-md"
        />
        <span className="mt-4 text-small font-medium">{getRangeString()}</span>
      </PopoverContent>
    </Popover>
  );
}
