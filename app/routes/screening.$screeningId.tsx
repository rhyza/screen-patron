import { Avatar, Button } from '@nextui-org/react';
import { MapPinIcon, TicketIcon, UserGroupIcon } from '~/components/Icons';

export default function ScreeningForm() {
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const cost = 5;
  const going = 14;
  const maybe = 2;

  const infoField = (icon: JSX.Element, text: string | JSX.Element) => {
    return (
      <div className='flex items-center gap-2'>
        <span className='flex-none'>{icon}</span>
        <span className='flex-initial'>{text}</span>
      </div>
    );
  };

  const rsvpButton = (icon: string | JSX.Element, label?: string) => {
    return (
      <div className='flex flex-wrap justify-center'>
        <Button className='text-5xl w-fit h-fit p-4' isIconOnly radius='full'>{icon}</Button>
        <p>{label}</p>
      </div>
    );
  };

  return (
    <div className='w-full p-6'>
      <div className='flex flex-wrap-reverse gap-6 justify-center'>
        <div className='flex-auto space-y-4 max-w-xl min-w-[360px]'>
          <h1 className='text-5xl'> Event Name</h1>
          <div>
            <p className='text-3xl'>Wednesday, Feb 21</p>
            <p className='text-2xl'>7:00pm – 10:00pm</p>
          </div>
          {infoField(<MapPinIcon />, 'Location')}
          {infoField(<TicketIcon />, `$${cost} per person`)}
          {infoField(<UserGroupIcon />, 'Unlimited Spots')}
          <p>{description}</p>
          <div className='flex items-center gap-2'>
            <span className='flex-none'>{going} Going</span>
            {maybe && <span className='flex-none'>{maybe} Maybe</span>}
          </div>
          <div className="flex gap-2 items-center">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            <Avatar name="+10" />
          </div>
        </div>
        <div className='flex-auto items-center justify-center max-w-96'>
          <img
            className='object-cover size-96'
            src='https://placehold.co/800?text=Poster&font=roboto'
          />
          <div className='flex justify-around p-6'>
            {rsvpButton('👍', 'Going')}
            {rsvpButton('🤔', 'Maybe')}
            {rsvpButton('👎', 'Not Going')}
          </div>
        </div>
      </div>
    </div>
  );
}