import { useState } from 'react';
import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Button, Card, cn, Input } from '@nextui-org/react';

import { createUser } from '~/models/user.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await createUser(data);
  return redirect(`/signin`);
};

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const validateEmail = (value: string) => {
    setEmail(() => value);
    if (value.length < 7) {
      setIsValid(() => false);
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
        <Form className="flex flex-col justify-center gap-8" method="post">
          <h1 className="text-xl md:text-3xl font-extrabold uppercase">Sign In or Sign Up</h1>
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
            className="w-32 bg-gradiant"
            isDisabled={!isValid}
            radius="none"
            type="submit"
          >
            Next
          </Button>
        </Form>
      </Card>
    </div>
  );
}
