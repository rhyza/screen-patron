import { PressEvent } from '@react-types/shared';
import { Button, cn } from '@nextui-org/react';

export default function RSVPModalTrigger({
  onTrigger,
  response = '',
}: {
  onTrigger: (e: PressEvent) => void;
  response: string | undefined;
}) {
  const isGoing = response === 'GOING';
  const options = [
    {
      id: 'GOING',
      label: isGoing ? `You're going!` : 'Going',
      icon: isGoing ? '🎉' : '👍',
      className: '',
    },
    { id: 'MAYBE', label: 'Maybe', icon: '🤔', className: '' },
    { id: 'NOT_GOING', label: `Can't Go`, icon: '😢', className: '' },
  ];

  return (
    <div className="flex justify-around my-6 gap-4">
      {options.map((option) => (
        <Button
          className={cn(
            'text-md !p-6',
            option.className,
            response != '' && response != option.id ? 'hidden' : '',
            response != '' && response === option.id ? 'bg-violet-600' : '',
          )}
          id={option.id}
          key={option.id}
          onPress={onTrigger}
          radius="full"
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
