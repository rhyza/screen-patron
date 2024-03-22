import { useState } from 'react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Button, Card, cn, Input } from '@nextui-org/react';

import { getSupabaseServerClient } from '~/db.server';
import { signIn } from '~/models/user.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign In | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { supabase } = getSupabaseServerClient(request);
  const { error } = await signIn(supabase, values);
  if (error) {
    return json({ success: false, error });
  }
  return json({ success: true, error });
};

/**
 * `/signin` — Page for Users to sign in. Sends an email to complete the process.
 */
export default function SignInPage() {
  const actionData = useActionData<typeof action>();
  const hasSent = actionData?.success || false;

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
    <div className="grid place-content-center h-[75vh]">
      <Card
        className={cn(
          'w-[20rem] md:w-[30rem] max-w-md md:max-w-5xl',
          'bg-default-100/50 border-none p-8',
        )}
        radius="sm"
        shadow="sm"
      >
        {!hasSent && (
          <Form className="flex flex-col justify-center gap-8" method="post">
            <h1 className="text-xl md:text-3xl font-extrabold uppercase">
              Sign In or Sign Up
            </h1>
            <Input
              classNames={{
                inputWrapper: [
                  'border-indigo-100 after:bg-indigo-500 ',
                  'hover:border-indigo-400 active:border-indigo-400 focus:border-indigo-400',
                ],
              }}
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
              isDisabled={!isValid}
              radius="none"
              type="submit"
            >
              Next
            </Button>
          </Form>
        )}
        {hasSent && (
          <div className="grid content-center justify-center my-8">
            <p className="text-2xl text-center">Check your email for your sign in link!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
