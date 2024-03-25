import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';

import UserForm from '~/components/UserForm';
import { profilesStoragePath, userPlaceholderImage } from '~/assets';
import type { OutletContext } from '~/db.server';
import { getSession, getSupabaseServerClient, uploadImage, deleteImage } from '~/db.server';
import { updateUser } from '~/models/user.server';
import { invariant, retypeNull } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Edit Profile | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || session?.user?.id != params.userId) {
    // User not signed in
    throw redirect(`/user/${params.userId}`, 302);
  }

  const formData = await request.formData();
  let { photo, prevPhoto, ...updates } = Object.fromEntries(formData);

  // Check if user added new photo
  if (typeof photo === 'object' && photo.size != 0) {
    // Try to upload new photo to storage, wait for returned public url
    const { path, error } = await uploadImage(
      supabase,
      'profiles',
      `${params.userId}_${Date.now()}`,
      photo,
    );

    if (!error) {
      // If no errors, update the photo URL
      updates = { ...updates, photo: path };

      // And delete the old photo if one exists
      if (prevPhoto && typeof prevPhoto === 'string' && prevPhoto != userPlaceholderImage) {
        const prevPhotoPath = prevPhoto.slice(profilesStoragePath.length);
        deleteImage(supabase, 'profiles', prevPhotoPath);
      }
    } else {
      console.log(error);
    }
  }

  await updateUser(params.userId, updates);
  return redirect(`/user/${params.userId}`);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');

  /**
   * Only the signed in user can access this page, so there's no need to check if a user with
   * params.userId exists first. If a user directs themselves to this page using a
   * non-existing userId, e.g. `/badId/edit`, then they are redirected to `/badId`,
   * which triggers user.$userId.tsx's 404 error. This saves us an `await getUser()` call.
   */
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || session?.user?.id != params.userId) {
    throw redirect(`/user/${params.userId}`, 302);
  }

  return json({ session });
};

/**
 * `/user/$userId/edit` — Page for editing an existing User's profile.
 */
export default function EditUser() {
  const { user } = useOutletContext<OutletContext>();

  return <UserForm {...retypeNull(user)} />;
}
