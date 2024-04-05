import { useNavigate } from '@remix-run/react';
import { Button, ButtonGroup } from '@nextui-org/button';

import { PendingIcon } from './Icons';

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
