import { useState, createContext, useContext } from 'react';
import { Button, cn } from '@nextui-org/react';

const ButtonTabContext = createContext({
  activeTab: '',
  handlePress: (id: string): void => {
    if (id) return;
  },
});

/**
 * Renders a row buttons that switches which button maintains an active state when pressed.
 * Intended to be used as a tab switcher.
 * @param className Any Tailwind classes to apply to the container
 * @param defaultTab The `id` of the tab to be active on first render.
 * @param setTabContent Function that sets what happens when each button is pressed
 * @returns
 */
export function ButtonTabs({
  children,
  className = '',
  defaultTab = '',
  setTabContent,
}: {
  defaultTab?: string;
  setTabContent: (id: string) => void;
} & React.ComponentProps<'div'>) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const handlePress = (id: string) => {
    setActiveTab(() => id);
    setTabContent(id);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <ButtonTabContext.Provider value={{ activeTab, handlePress }}>
        {children}
      </ButtonTabContext.Provider>
    </div>
  );
}

export function ButtonTab({
  id,
  children,
  className,
}: {
  id: string;
} & React.ComponentProps<'span'>) {
  const { activeTab, handlePress } = useContext(ButtonTabContext);
  const active = id === activeTab ? 'bg-foreground text-background' : '';

  return (
    <Button
      className={cn(active, className)}
      id={id}
      key={id}
      onPress={() => handlePress(id)}
      radius="full"
    >
      {children}
    </Button>
  );
}
