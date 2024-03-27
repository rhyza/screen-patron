import { useState } from 'react';
import type { PressEvent } from '@react-types/shared';
import { Button } from '@nextui-org/react';

export default function ButtonTabs({
  setTabContent,
  tabs,
}: {
  setTabContent: (id: string) => void;
  tabs: {
    id: string;
    label: string | JSX.Element;
  }[];
}) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const handlePress = (event: PressEvent) => {
    const { id } = event.target;
    setActiveTab(() => id);
    setTabContent(id);
  };

  return (
    <div className="flex gap-2 p-2">
      {tabs.map((tab) => (
        <ButtonTab activeTab={activeTab} handlePress={handlePress} id={tab.id} key={tab.id}>
          {tab.label}
        </ButtonTab>
      ))}
    </div>
  );
}

function ButtonTab({
  id,
  activeTab,
  handlePress,
  children,
}: {
  id: string;
  activeTab: string;
  handlePress: (e: PressEvent) => void;
  children: string | JSX.Element;
}) {
  const active = id === activeTab ? 'bg-foreground text-background' : '';
  return (
    <Button className={active} onPress={handlePress} id={id} radius="full">
      {children}
    </Button>
  );
}
