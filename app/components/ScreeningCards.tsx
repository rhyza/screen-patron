import ScreeningCard from './ScreeningCard';
import type { ScreeningRecord } from '~/services/screening';

export default function ScreeningCards({
  screenings = []
}: {screenings: ScreeningRecord[]}) {

  return (
    <div className='w-full p-6 flex justify-center'>
      {screenings.length ? (
        <div className='max-w-[70rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {screenings.map((screening: ScreeningRecord) => (
            <div key={screening.id} className='flex max-w-[400px] min-w-64'>
              <ScreeningCard screening={screening} />
            </div>
          ))}
        </div>
      ) :
        <p><i>No screenings</i></p>
      }
    </div>
  );
}