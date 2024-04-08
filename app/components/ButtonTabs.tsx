import { useState, createContext, useContext } from 'react';
import { Button, cn } from '@nextui-org/react';

const ButtonTabContext = createContext({
  activeTab: '',
  handlePress: (id: string): void => {
    if (id) return;
  },
});

/**
 * Tab switcher composed of a row buttons. The buttons change the state controlled by the
 * given callback function. Each button will display an active state when pressed and will
 * maintain that state until a different button is pressed.
 * @param className Any Tailwind classes to apply to the container
 * @param defaultTab The `id` of the tab to be active on first render
 * @param setTabContent Function that sets what happens when each button is pressed
 */
export function ButtonTabs({
  children,
  className = '',
  defaultTab = '',
  isDeselectable = false,
  setTabContent,
}: {
  defaultTab?: string;
  isDeselectable?: boolean;
  setTabContent: (id: string) => void;
} & React.ComponentProps<'div'>) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const handlePress = (id: string) => {
    if (isDeselectable && activeTab === id) {
      setActiveTab(() => '');
      setTabContent('');
    } else {
      setActiveTab(() => id);
      setTabContent(id);
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <ButtonTabContext.Provider value={{ activeTab, handlePress }}>
        {children}
      </ButtonTabContext.Provider>
    </div>
  );
}

/**
 * Button for use with ButtonTabs. Inherits an active state from ButtonTabs.
 * @param id Tab identifier string
 * @param className Any Tailwind classes to apply to the Button
 */
export function ButtonTab({
  id,
  children,
  className,
  isDisabled = false,
}: {
  id: string;
  isDisabled?: boolean;
} & React.ComponentProps<'span'>) {
  const { activeTab, handlePress } = useContext(ButtonTabContext);
  const active = id === activeTab ? 'bg-foreground text-background' : '';

  return (
    <Button
      className={cn(active, className)}
      id={id}
      isDisabled={isDisabled}
      key={id}
      onPress={() => handlePress(id)}
      radius="full"
    >
      {children}
    </Button>
  );
}
