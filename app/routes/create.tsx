import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
import { Modal, ModalContent } from '@nextui-org/react';

import EventForm from '~/components/EventForms';
import SignInFlow from '~/components/SignInFlow';

import { getSupabaseServerClient, getUserId, uploadImage } from '~/db.server';
import { signIn } from '~/models/user.server';
import { createEvent } from '~/models/event.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);

  return { isSignedIn: userId != null };
};

/**
 * `create` — Page for creating a new Event.
 */
export default function CreateEvent() {
  const { isSignedIn } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ success: boolean; error: string | null }>();
  const hasSent = fetcher.data?.success || false;

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === '/create';

  return (
    <div className="page-container">
      <Modal
        backdrop="opaque"
        classNames={{ backdrop: 'bg-gradient mix-blend-multiply' }}
        defaultOpen={!isSignedIn && !hasSent}
        hideCloseButton={!hasSent}
        isDismissable={hasSent}
        placement="center"
        size="md"
      >
        <ModalContent className="p-10">
          <SignInFlow fetcher={fetcher} />
        </ModalContent>
      </Modal>
      <EventForm isDisabled={!isSignedIn} isSubmitting={isSubmitting} />
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (!userId) {
    const values = Object.fromEntries(await formData);
    const { error } = await signIn(supabase, values);
    if (error) {
      return json({ success: false, error });
    }
    return json({ success: true, error });
  }

  // If signed in, continue with new event submission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
  let { photo, prevPhoto, ...updates } = Object.fromEntries(await formData);

  // Check if user added a photo
  if (typeof photo === 'object' && photo.size != 0) {
    // Try to upload the photo to storage, wait for returned public url
    const { path, error } = await uploadImage(
      supabase,
      'events',
      `${userId}_${Date.now()}`,
      photo,
    );

    if (!error) {
      // If no errors, add the photo URL
      updates = { ...updates, photo: path };
    } else {
      console.log(error);
    }
  }

  const event = await createEvent(userId, updates);
  return redirect(`/${event.id}`);
};
