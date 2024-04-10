import type { RadioProps } from '@nextui-org/react';
import { VisuallyHidden, cn, useRadio } from '@nextui-org/react';

/**
 * Custom radio input buttons with an icon displayed in the center. This component modifies
 * a basic html input element.
 * @param size (optional) The size of the button, options are `sm`, `md`, or `lg`,
 * default value is `md`
 */
export default function RadioIcon({ size = 'md', ...props }: { size?: string } & RadioProps) {
  const { Component, children, description, isDisabled, getBaseProps, getInputProps } =
    useRadio(props);

  const sizeMap = {
    sm: 'text-2xl sm:text-3xl size-16 md:size-20 p-4',
    md: 'text-3xl sm:text-4xl size-20 md:size-24 p-4',
    lg: 'text-4xl sm:text-5xl size-24 lg:size-28 p-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Component
        {...getBaseProps()}
        className={cn(
          'flex items-center justify-center tap-highlight-transparent',
          'bg-slate-200 hover:bg-indigo-100 active:opacity-50',
          'cursor-pointer border-0 border-default rounded-full mb-2',
          'data-[selected=true]:border-secondary data-[selected=true]:border-4',
          'data-[selected=true]:p-3 data-[selected=true]:bg-indigo-200',
          sizeMap[size],
          isDisabled && 'opacity-50',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          className={cn(
            'flex items-center justify-center m-0 rounded-full gap-4',
            sizeMap[size],
          )}
        >
          {children}
        </div>
      </Component>
      <div className={cn('flex justify-center', isDisabled && 'opacity-50')}>
        {description}
      </div>
    </div>
  );
}
