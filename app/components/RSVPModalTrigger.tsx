import { PressEvent } from '@react-types/shared';

import IconButton from './IconButton';

export default function RSVPModalTrigger({
  onTrigger,
  response = '',
}: {
  onTrigger: (e: PressEvent) => void;
  response: string | undefined;
}) {
  const options = [
    { id: 'GOING', label: 'Going', icon: '👍' },
    { id: 'MAYBE', label: 'Maybe', icon: '🤔' },
    { id: 'NOT_GOING', label: `Can't Go`, icon: '😢' },
  ];

  return (
    <div className="flex justify-around m-6">
      {options.map((option) => (
        <IconButton
          id={option.id}
          key={option.id}
          isHidden={response != '' && response != option.id}
          isSelected={response != '' && response === option.id}
          label={option.label}
          onPress={onTrigger}
        >
          {option.icon}
        </IconButton>
      ))}
    </div>
  );
}
