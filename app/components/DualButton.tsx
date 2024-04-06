import { useNavigate } from '@remix-run/react';
import { Button, ButtonGroup } from '@nextui-org/button';

import { PendingIcon } from './Icons';

/**
 * Set of two styled buttons for confirm/deny actions with active, disabled, and pending
 * states. Default labels are Save and Cancel. The Save button is of type "submit" and the
 * Cancel button goes back a page. Each buttons props and actions can be overriden.
 * @param groupProps (optional) ButtonGroup props that control the look of both buttons, see
 * NextUI's ButtonGroup docs for reference
 * @param isSubmitting (optional) Boolean to set the buttons to a pending state
 * @param primaryLabel (optional) Label for the primary button
 * @param primaryProps (optional) Additional Button props for the primary button, can be used
 * to override default props and actions, see NextUI's Button docs for reference
 * @param seoncdaryLabel (optional) Label for the seoncdary button
 * @param seoncdaryProps (optional) Additional Button props for the seoncdary button, can be
 * used to override default props and actions, see NextUI's Button docs for reference
 * @param submitDisabled (optional) Boolean to set the buttons to a disabled state
 */
export default function DualButton({
  groupProps,
  isSubmitting,
  primaryLabel = 'Save',
  primaryProps,
  secondaryLabel = 'Cancel',
  secondaryProps,
  submitDisabled,
}: {
  groupProps?: React.ComponentPropsWithRef<typeof ButtonGroup>;
  primaryLabel?: string;
  primaryProps?: React.ComponentPropsWithRef<typeof Button>;
  isSubmitting?: boolean;
  secondaryLabel?: string;
  secondaryProps?: React.ComponentPropsWithRef<typeof Button>;
  submitDisabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <ButtonGroup className="w-64" fullWidth radius="none" {...groupProps}>
      <Button
        className="bg-primary"
        isDisabled={submitDisabled || isSubmitting}
        startContent={isSubmitting && <PendingIcon />}
        type="submit"
        {...primaryProps}
      >
        {primaryLabel}
      </Button>
      <Button
        className="border-primary"
        isDisabled={isSubmitting}
        onPress={() => navigate(-1)}
        variant="bordered"
        {...secondaryProps}
      >
        {secondaryLabel}
      </Button>
    </ButtonGroup>
  );
}
