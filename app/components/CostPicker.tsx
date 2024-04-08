import { useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from '@nextui-org/react';

import { DollarIcon } from './Icons';

export default function CostPicker() {
  const [range, setRange] = useState<number[]>([0, 100]);
  const getPriceRange = () => {
    const [min, max] = range;
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
          className="max-md:px-unit-0 max-md:min-w-unit-10"
          radius="full"
          startContent={<DollarIcon />}
        >
          <span className="max-md:hidden">Cost</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 py-4 px-6 bg-foreground text-background">
        <Slider
          arai-label="Price Range"
          step={1}
          minValue={0}
          maxValue={100}
          value={range}
          onChange={(input) => typeof input != 'number' && setRange(input)}
          className="max-w-md"
        />
        <span className="mt-4 text-small font-medium">{getPriceRange()}</span>
      </PopoverContent>
    </Popover>
  );
}
