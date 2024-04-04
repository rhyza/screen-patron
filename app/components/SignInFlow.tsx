import { useState } from 'react';

import type { FetcherWithComponents } from '@remix-run/react';
import { Form } from '@remix-run/react';
import { Button, Input, cn } from '@nextui-org/react';

/**
 * Sign in flow that shows a sign in form that only takes in a User's email, then changes to
 * a success message upon submission. Made for use within Cards, Modals, or other containers.
 * @param classnames (optional) Any Tailwind classes to apply to the success message div
 * @param fetcher An instantiation of useFetcher()
 * @param showConfirmation (optional) Boolean indicating whether or not to show the
 * confirmation message. SignInFlow will show a confirmation message automatically, use this
 * to manually control that state.
 */
export default function SignInFlow({
  classNames,
  fetcher,
  showConfirmation,
}: {
  classNames?: string;
  fetcher: FetcherWithComponents<{ success: string | boolean | null; error: string | null }>;
  showConfirmation?: boolean;
}) {
  const success = fetcher.data?.success || null;
  const hasEmailSent = success === true || success != null;
  const confirmation = showConfirmation != undefined ? showConfirmation : hasEmailSent;

  return (
    <>
      {!confirmation && <SignInForm fetcher={fetcher} />}
      {confirmation && (
        <div className={cn('grid content-center justify-center my-8', classNames)}>
          <p className="text-2xl text-center">Check your email for your sign in link!</p>
        </div>
      )}
    </>
  );
}

/**
 * Form for signing in, only takes in a User's email.
 * @param formProps (optional) Any props supplied are applied to the Form component,
 * reference Remix Form docs for guidance
 */
export function SignInForm({
  fetcher,
  ...formProps
}: {
  fetcher: FetcherWithComponents<unknown>;
} & React.ComponentPropsWithRef<typeof Form>) {
  const isSubmitting = fetcher.state === 'submitting';

  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const validateEmail = (value: string) => {
    setEmail(() => value);
    if (value.length < 7) {
      setIsValid(() => false);
      // eslint-disable-next-line no-useless-escape
    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      setIsValid(() => true);
    } else {
      setIsValid(() => false);
    }
  };

  return (
    <fetcher.Form className="flex flex-col justify-center gap-8" method="post" {...formProps}>
      <h1 className="text-xl md:text-3xl font-extrabold uppercase">Sign In or Sign Up</h1>
      <Input
        classNames={{
          inputWrapper: [
            'border-indigo-100 after:bg-indigo-500 ',
            'hover:border-indigo-400 active:border-indigo-400 focus:border-indigo-400',
          ],
        }}
        isDisabled={isSubmitting}
        label="Enter your email"
        name="email"
        onValueChange={validateEmail}
        size="lg"
        type="email"
        value={email}
        variant="underlined"
      />
      <Button
        className="w-32 bg-gradient"
        isDisabled={!isValid || isSubmitting}
        radius="none"
        type="submit"
      >
        Next
      </Button>
    </fetcher.Form>
  );
}
