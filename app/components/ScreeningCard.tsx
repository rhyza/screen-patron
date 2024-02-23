import { useNavigate } from '@remix-run/react';
import { Card, CardFooter, CardHeader } from '@nextui-org/react';
import { ScreeningRecord } from '~/services/screening';
import { getDateString, getTimeString } from '~/utils';

export default function ScreeningCard({
  screening,
  imageClassName = 'size-full',
  ...cardProps
}: {screening: ScreeningRecord, [propName: string]: any}) {
  const { id, name, coverImage, dateStart } = screening;
  const image = coverImage || 'https://placehold.co/800?text=Event&font=roboto';
  const date = dateStart ? new Date(dateStart) : undefined;
  const dateString = date ? getDateString({date: date}) : 'Date TBD';
  const timeString = date ? getTimeString({date: date}) : 'Time TBD'

  const navigate = useNavigate();
  const handlePress = () => {
    navigate('/screening/' + id);
  };

  return (
    <Card className='flex-1 m-4 w-full bg-transparent p-2 text-foreground' isPressable key={id} onPress={handlePress} radius='sm' shadow='sm' {...cardProps}>
      <CardHeader className='flex flex-col items-start'>
        <p className='text-xs uppercase font-bold'>{dateString}</p>
        <p className='text-xs text-default-500'>{timeString}</p>
        <p className='text-base font-bold justify-self-start truncate overflow-hidden'>{name}</p>
      </CardHeader>
      <img className={'object-cover rounded-md ' + imageClassName} src={image} />
    </Card>
  );
}