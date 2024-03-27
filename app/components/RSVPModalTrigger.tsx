import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { useDisclosure } from '@nextui-org/react';

import IconButton from './IconButton';
import RSVPModal from './RSVPModal';

export default function RSVPModalTrigger({
  response = '',
}: {
  response: string | undefined;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rsvp, setRsvp] = useState(response);
  const handleModalOpen = (event: PressEvent) => {
    const { id } = event.target;
    setRsvp(() => id);
    onOpen();
  };

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
          onPress={handleModalOpen}
        >
          {option.icon}
        </IconButton>
      ))}
      <RSVPModal isOpen={isOpen} onOpenChange={onOpenChange} selected={rsvp} />
    </div>
  );
}
