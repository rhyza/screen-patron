import { useState } from 'react';
import type { PressEvent } from '@react-types/shared';
import { Button, cn } from '@nextui-org/react';

/**
 * Renders a row buttons that switches which button maintains an active state when pressed.
 * Intended to be used as a tab switcher.
 * @param setTabContent Function that sets what happens when each button is pressed
 * @param tabs An array of objects naming the id and label of each button, label can either
 * be a string or a JSX element
 * @returns
 */
export default function ButtonTabs({
  classNames = {
    container: '',
    button: '',
  },
  defaultTab = '',
  setTabContent,
  tabs,
}: {
  classNames?: {
    container?: string;
    button?: string;
  };
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
    <div className={cn('flex gap-2', classNames?.container)}>
      {tabs.map((tab) => (
        <ButtonTab
          activeTab={activeTab}
          classNames={classNames?.button}
          handlePress={handlePress}
          id={tab.id}
          key={tab.id}
        >
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
  classNames,
}: {
  id: string;
  activeTab: string;
  handlePress: (e: PressEvent) => void;
  children: string | JSX.Element;
  classNames?: string;
}) {
  const active = id === activeTab ? 'bg-foreground text-background' : '';
  return (
    <Button className={cn(active, classNames)} onPress={handlePress} id={id} radius="full">
      {children}
    </Button>
  );
}
