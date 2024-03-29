import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { Modal, ModalContent } from '@nextui-org/react';

import EventForm from '~/components/EventForm';
import SignInFlow from '~/components/SignInFlow';
import { getSupabaseServerClient, getUserId, uploadImage } from '~/db.server';
import { signIn } from '~/models/user.server';
import { createEvent, updateEvent } from '~/models/event.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const session = await getUserId(supabase);

  return { isSignedIn: session != null };
};

/**
 * `create` — Page for creating a new Event.
 */
export default function CreateEvent() {
  const { isSignedIn } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const hasSent = actionData?.success || false;

  return (
    <div className="page-container">
      <Modal
        backdrop="opaque"
        defaultOpen={!isSignedIn && !hasSent}
        hideCloseButton={!hasSent}
        isDismissable={hasSent}
        placement="center"
        size="md"
        classNames={{ backdrop: 'bg-gradient mix-blend-multiply' }}
      >
        <ModalContent className="p-10">
          <SignInFlow hasEmailSent={hasSent} />
        </ModalContent>
      </Modal>
      <EventForm isDisabled={!isSignedIn} />
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { photo, prevPhoto, ...updates } = Object.fromEntries(await formData);
  const event = await createEvent(userId, { ...updates });

  // Need eventId before photo can be uploaded, check if user added a photo
  if (typeof photo === 'object' && photo.size != 0) {
    // Try to upload the photo to storage, wait for returned public url
    const { path, error } = await uploadImage(
      supabase,
      'events',
      `${event.id}_${Date.now()}`,
      photo,
    );

    if (!error) {
      // If no errors, update the photo URL
      await updateEvent(event.id, { photo: path });
    } else {
      console.log(error);
    }
  }

  return redirect(`/e/${event.id}`);
};
