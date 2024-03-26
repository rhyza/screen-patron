import { useState } from 'react';
import { Form } from '@remix-run/react';
import { Button, Input } from '@nextui-org/react';

export default function SignInForm() {
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
      <Button className="w-32 bg-gradient" isDisabled={!isValid} radius="none" type="submit">
        Next
      </Button>
    </Form>
  );
}
