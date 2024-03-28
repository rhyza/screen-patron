import { cn } from '@nextui-org/react';

import SignInForm from './SignInForm';

export default function SignInFlow({
  classNames,
  hasEmailSent = false,
}: {
  classNames?: string;
  hasEmailSent: boolean;
}) {
  return (
    <>
      {!hasEmailSent && <SignInForm />}
      {hasEmailSent && (
        <div className={cn('grid content-center justify-center my-8', classNames)}>
          <p className="text-2xl text-center">Check your email for your sign in link!</p>
        </div>
      )}
    </>
  );
}
