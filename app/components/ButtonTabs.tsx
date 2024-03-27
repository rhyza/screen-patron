import { useState } from 'react';
import type { PressEvent } from '@react-types/shared';
import { Button } from '@nextui-org/react';

/**
 * Renders a row buttons that switches which button maintains an active state when pressed.
 * Intended to be used as a tab switcher.
 * @param setTabContent Function that sets what happens when each button is pressed
 * @param tabs An array of objects naming the id and label of each button, label can either
 * be a string or a JSX element
 * @returns
 */
export default function ButtonTabs({
  defaultTab = '',
  setTabContent,
  tabs,
}: {
  defaultTab?: string;
  setTabContent: (id: string) => void;
  tabs: {
    id: string;
    label: string | JSX.Element;
  }[];
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
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
