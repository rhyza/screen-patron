import { cn } from '@nextui-org/react';

export default function BackgroundGradient({ photo }: { photo: string }) {
  return (
    <>
      <div
        className={cn(
          'z-[-9] absolute inset-0 h-full w-full',
          'bg-gradient-to-t from-black from-30% to-black/60',
        )}
      />
      <img
        alt=""
        className={cn(
          'z-[-10] absolute inset-0 object-cover h-[80vh] w-full',
          'blur-3xl overflow-hidden',
        )}
        src={photo}
      />
    </>
  );
}
