import type { FetcherWithComponents } from '@remix-run/react';
import { Button, Input, RadioGroup } from '@nextui-org/react';

import { PendingIcon } from './Icons';
import RadioIcon from './RadioIcon';

/**
 * Modal containing an RSVP form
 * @param fetcher An instantiation of useFetcher()
 * @param onClose A callback function to close a modal
 * @param selected The selected RSVP response, the options are "GOING", "MAYBE",
 * or "NOT_GOING"
 */
export default function RSVPForm({
  fetcher,
  onClose,
  selected,
}: {
  fetcher: FetcherWithComponents<{ success: string | null; error: string | null }>;
  onClose: () => void;
  selected?: string;
}) {
  const isSubmitting = fetcher.state === 'submitting';

  return (
    <fetcher.Form className="flex flex-wrap justify-center gap-6" method="post">
      <RadioGroup
        className="p-6"
        defaultValue={selected}
        isDisabled={isSubmitting}
        isRequired
        name="status"
        orientation="horizontal"
      >
        <RadioIcon description="Going" size="lg" value="GOING">
          👍
        </RadioIcon>
        <RadioIcon description="Maybe" size="lg" value="MAYBE">
          🤔
        </RadioIcon>
        <RadioIcon description="Can't Go" size="lg" value="NOT_GOING">
          😢
        </RadioIcon>
      </RadioGroup>
      <Input
        label="Your Name"
        isDisabled={isSubmitting}
        name="name"
        radius="none"
        size="lg"
        type="text"
      />
      <div className="flex justify-center">
        <Button
          className="w-32 bg-primary"
          isDisabled={isSubmitting}
          radius="none"
          startContent={isSubmitting && <PendingIcon />}
          type="submit"
        >
          Save
        </Button>
        <Button className="w-32" isDisabled={isSubmitting} onPress={onClose} radius="none">
          Cancel
        </Button>
      </div>
    </fetcher.Form>
  );
}
