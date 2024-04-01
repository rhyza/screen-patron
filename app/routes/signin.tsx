import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Card, cn } from '@nextui-org/react';

import SignInFlow from '~/layouts/SignInFlow';

import { getSupabaseServerClient } from '~/db.server';
import { signIn } from '~/models/user.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign In | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

/**
 * `/signin` — Page for Users to sign in. Sends an email to complete the process.
 */
export default function SignInPage() {
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
        <SignInFlow />
      </Card>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();
  const { supabase } = getSupabaseServerClient(request);

  const values = Object.fromEntries(await formData);
  const { error } = await signIn(supabase, values);
  if (error) {
    return json({ success: false, error });
  }
  return json({ success: true, error });
};
