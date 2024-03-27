import { Form } from '@remix-run/react';
import { Button, Input, RadioGroup } from '@nextui-org/react';

import RadioIcon from './RadioIcon';

/**
 * Modal containing an RSVP form
 * @param selected The selected RSVP response, the options are "GOING", "MAYBE",
 * or "NOT_GOING"
 * @param modalProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Modal docs for available options
 */
export default function RSVPForm({
  onClose,
  selected,
}: {
  onClose: () => void;
  selected?: string;
}) {
  return (
    <Form className="flex flex-wrap justify-center gap-6" method="post">
      <RadioGroup
        className="p-6"
        defaultValue={selected}
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
      <Input label="Your Name" name="name" radius="none" size="lg" type="text" />
      <div className="flex justify-center">
        <Button className="w-32 bg-primary" radius="none" type="submit">
          Save
        </Button>
        <Button className="w-32" onPress={onClose} radius="none">
          Cancel
        </Button>
      </div>
    </Form>
  );
}
