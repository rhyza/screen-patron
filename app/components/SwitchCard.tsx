import { Switch, cn } from '@nextui-org/react';

/**
 * A pressable card with label and switch input.
 * @param label The input label
 * @param description (optional) The label caption
 * @param radius (optional) The card's border radius: "none", "sm", "md", etc.
 * @param switchProps (optional) Any additional props are applied to the Switch component,
 * reference the NextUI Switch docs for available options
 */
export default function SwitchCard({
  className,
  description,
  label,
  radius,
  startContent,
  ...switchProps
}: {
  description?: string;
  label: string;
  radius?: string;
} & React.ComponentPropsWithRef<typeof Switch>) {
  return (
    <Switch
      classNames={{
        base: cn(
          'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center',
          'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-secondary',
          className,
          radius && `rounded-${radius}`,
          switchProps.isDisabled && 'cursor-default opacity-50 hover:!bg-default-100/60',
        ),
        wrapper: 'p-0 h-4 overflow-visible',
        thumb: cn(
          'w-6 h-6 border-2 shadow-lg',
          'group-data-[hover=true]:border-secondary',
          //selected
          'group-data-[selected=true]:ml-6',
          // pressed
          'group-data-[pressed=true]:w-7',
          'group-data-[selected]:group-data-[pressed]:ml-4',
        ),
      }}
      role="switch"
      {...switchProps}
    >
      <div className="flex gap-4 items-center">
        {startContent}
        <div className="flex flex-col gap-1">
          <p className="text-medium">{label}</p>
          {description && <p className="text-tiny text-default-300">{description}</p>}
        </div>
      </div>
    </Switch>
  );
}
