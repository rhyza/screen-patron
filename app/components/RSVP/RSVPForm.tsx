import type { FetcherWithComponents } from '@remix-run/react';
import { Input, RadioGroup } from '@nextui-org/react';

import DualButton from '~/components/DualButton';
import RadioIcon from '~/components/RadioIcon';

/**
 * Modal containing an RSVP form
 * @param fetcher An instantiation of useFetcher()
 * @param onClose A callback function to close a modal
 * @param selected The selected RSVP response, the options are "GOING", "MAYBE",
 * or "NOT_GOING"
 */
export default function RSVPForm({
  fetcher,
  name,
  onClose,
  selected,
}: {
  fetcher: FetcherWithComponents<{ success: string | null; error: string | null }>;
  name?: string;
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
        classNames={{
          inputWrapper: '!bg-transparent',
        }}
        defaultValue={name}
        label="Your Name"
        isDisabled={isSubmitting}
        name="name"
        radius="none"
        size="lg"
        type="text"
        variant="underlined"
      />
      <div className="flex justify-center">
        <DualButton isSubmitting={isSubmitting} secondaryProps={{ onPress: onClose }} />
      </div>
    </fetcher.Form>
  );
}
