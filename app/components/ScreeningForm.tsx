import { Button, Input } from '@nextui-org/react';

export default function ScreeningForm() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input type="email" label="Email" placeholder="Enter your email" />
      <Button>Press me</Button>
    </div>
  );
}