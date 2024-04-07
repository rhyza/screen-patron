import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from '@nextui-org/react';

import { DollarIcon } from './Icons';

export default function CostPicker() {
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button
          className="max-md:px-unit-0 max-md:min-w-unit-10"
          radius="full"
          startContent={<DollarIcon />}
        >
          <span className="max-md:hidden">Cost</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <Slider
          label="Price Range"
          step={1}
          minValue={0}
          maxValue={200}
          defaultValue={[0, 200]}
          formatOptions={{ style: 'currency', currency: 'USD' }}
          className="max-w-md"
        />
      </PopoverContent>
    </Popover>
  );
}
