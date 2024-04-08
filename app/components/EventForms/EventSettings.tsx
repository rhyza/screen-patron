import { Select, SelectItem } from '@nextui-org/react';

import SwitchCard from '~/components/SwitchCard';
import { ProhibitedIcon } from '~/components/Icons';

import type { EventFormProps } from '~/models/event.server';

export default function EventSettings({ isDisabled = false }: EventFormProps) {
  return (
    <fieldset className="flex-auto space-y-2 min-w-[300px] max-w-xl" disabled={isDisabled}>
      <Select
        isDisabled={isDisabled}
        label={
          <div className="flex items-center gap-2">
            <ProhibitedIcon />
            <span>Is this event age restricted?</span>
          </div>
        }
        name="age"
        radius="none"
      >
        <SelectItem key="none" value="none">
          No
        </SelectItem>
        <SelectItem key="18" value="18">
          18+
        </SelectItem>
        <SelectItem key="21" value="21">
          21+
        </SelectItem>
      </Select>
      <SwitchCard
        className="max-w-full"
        isDisabled={isDisabled}
        label="Is this event age restricted?"
        description=""
        name="age"
        startContent={<ProhibitedIcon />}
      />
    </fieldset>
  );
}
