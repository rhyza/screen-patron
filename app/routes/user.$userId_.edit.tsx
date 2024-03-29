import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';

import { profilesStoragePath, userPlaceholderImage } from '~/assets';
import UserForm from '~/layouts/UserForm';

import type { OutletContext } from '~/db.server';
import { getSupabaseServerClient, getUserId, uploadImage, deleteImage } from '~/db.server';
import { updateUser } from '~/models/user.server';
import { invariant, retypeNull } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Edit Profile | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');

  /**
   * Check if $userId is the same as the signed-in user.
   * Only the signed in user can access this page, so there's no need to check if a user with
   * params.userId exists first. If a user directs themselves to this page using a
   * non-existing userId, e.g. `/badId/edit`, then they are redirected to `/badId`,
   * which triggers user.$userId.tsx's 404 error. This saves us an `await getUser()` call.
   */
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (userId != params.userId) {
    throw redirect(`/user/${params.userId}`, 302);
  }

  return null;
};

/**
 * `/user/$userId/edit` — Page for editing an existing User's profile.
 */
export default function EditUser() {
  const { user } = useOutletContext<OutletContext>();

  return (
    <div className="page-container">
      <UserForm {...retypeNull(user)} />
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (userId != params.userId) {
    throw redirect(`/user/${params.userId}`, 302);
  }

  // eslint-disable-next-line prefer-const
  let { photo, prevPhoto, ...updates } = Object.fromEntries(await formData);

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
