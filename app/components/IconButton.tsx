import { Button, cn } from '@nextui-org/react';

export function IconButton({
  children,
  label,
  isSelected,
  size = 'md',
  ...buttonProps
}: {label?: string | JSX.Element, isSelected?: boolean, size?: string, [propName: string]: any}) {
  const sizes: {[key: string]: string} = {
    sm: 'text-2xl sm:text-3xl w-16 h-16 p-4',
    md: 'text-3xl sm:text-4xl w-20 h-20 p-4',
    lg: 'text-4xl sm:text-5xl w-24 h-24 p-4',
  }

  return (
    <div className='flex flex-wrap justify-center w-24 sm:w-28'>
      <Button
        className={cn(
          sizes[size],
          isSelected ? 'border-4 border-secondary p-3 bg-indigo-200' : ''
        )}
        isIconOnly
        radius='full'
        {...buttonProps}
      >
        {children}
      </Button>
      <p>{label}</p>
    </div>
  );
}