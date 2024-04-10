import type { SetStateAction } from 'react';
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
 * @param className (optional) Any Tailwind classes to apply to the container
 * @param defaultTab (optional) The `id` of the tab to be active on first render (uncontrolled)
 * @param isDeselectable (optional) Allows buttons to be pressed again to deselect
 * @param onTabChange (optional) Handler that is called when the tab changes
 * @param setTabContent Handler that is called when the tab changes
 * @param tab (optional) The `id` of the current tab (controlled)
 */
export function ButtonTabs({
  children,
  className = '',
  defaultTab = '',
  isDeselectable = false,
  onTabChange,
  setTabContent,
  tab,
}: {
  defaultTab?: string;
  isDeselectable?: boolean;
  onTabChange?: (id: SetStateAction<string>) => void;
  setTabContent: (id: string) => void;
  tab?: string;
} & React.ComponentProps<'div'>) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const isControlled = tab != undefined;

  const handlePress = (id: string) => {
    if (isDeselectable && (isControlled ? tab === id : activeTab === id)) {
      if (!isControlled) setActiveTab(() => '');
      else if (onTabChange) onTabChange(() => '');
      setTabContent('');
    } else {
      if (!isControlled) setActiveTab(() => id);
      else if (onTabChange) onTabChange(() => id);
      setTabContent(id);
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <ButtonTabContext.Provider
        value={{ activeTab: isControlled ? tab : activeTab, handlePress }}
      >
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

  return (
    <Button
      className={cn(id === activeTab && 'bg-invert', className)}
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
