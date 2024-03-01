import ScreeningCard from './ScreeningCard';
import type { ScreeningRecord } from '~/services/screening';

export default function ScreeningCards({
  screenings = []
}: {screenings: ScreeningRecord[]}) {

  return (
    <div>
      {screenings.length ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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