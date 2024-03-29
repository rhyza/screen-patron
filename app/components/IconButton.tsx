import { Button, cn } from '@nextui-org/react';

/**
 * Circular icon only Button component.
 * @param isHidden (optional) Sets button to hidden, default value is `false`
 * @param isSelected (optional) Adds additional styling to indicate its selected status,
 * default value is `false`
 * @param label (optional) The label to render below the button
 * @param size (optional) The size of the button, options are `sm`, `md`, or `lg`,
 * default value is `md`
 * @param buttonProps (optional) Any additional props are applied to the Button component,
 * reference the NextUI Button docs for available options
 */
export default function IconButton({
  children,
  isHidden = false,
  isSelected = false,
  label,
  size = 'md',
  ...buttonProps
}: {
  isHidden?: boolean;
  isSelected?: boolean;
  label?: string | JSX.Element;
} & React.ComponentPropsWithRef<typeof Button>) {
  const sizeMap = {
    sm: 'text-2xl sm:text-3xl w-16 h-16 p-4',
    md: 'text-3xl sm:text-4xl w-20 h-20 p-4',
    lg: 'text-4xl sm:text-5xl w-24 h-24 p-4',
  };

  return (
    <div className={cn(isHidden ? 'hidden' : 'flex flex-wrap justify-center w-24 sm:w-28')}>
      <Button
        className={cn(
          sizeMap[size],
          isSelected ? 'border-4 border-secondary p-3 bg-indigo-200' : '',
        )}
        isIconOnly
        radius="full"
        {...buttonProps}
      >
        {children}
      </Button>
      <p>{label}</p>
    </div>
  );
}
