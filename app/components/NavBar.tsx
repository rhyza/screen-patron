import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, NavLink, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

import { FilmIcon } from './Icons';
import { userPlaceholderImage } from '~/assets';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { getUser } from '~/models/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  const user = session?.user?.id ? await getUser(session?.user?.id) : null;
  return json({ session, user });
};

/**
 * Navigation Bar for the entire app
 */
export default function NavBar() {
  const { session, user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Navbar maxWidth="full">
      <NavbarBrand as={NavLink} onClick={() => navigate('/')}>
        <FilmIcon classNames="max-sm:hidden mr-2" />
        <p className="font-bold text-inherit uppercase">Screen Patron</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarItem>
          <NavLink
            className={cn('max-sm:hidden', location.pathname != '/signin' && 'mr-2')}
            to="browse"
          >
            Browse Events
          </NavLink>
        </NavbarItem>
        <NavbarItem
          className={cn(
            'max-sm:hidden',
            (location.pathname === '/e/create' || location.pathname === '/signin') &&
              'hidden',
          )}
        >
          <Button
            as={NavLink}
            className="bg-primary mr-2"
            radius="none"
            to="e/create"
            variant="flat"
          >
            Create
          </Button>
        </NavbarItem>
        <NavbarItem className={cn((session || location.pathname === '/signin') && 'hidden')}>
          <Button
            as={NavLink}
            className="bg-foreground text-primary"
            radius="none"
            to="signin"
            variant="flat"
          >
            Sign In
          </Button>
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger className={cn(!session && 'hidden')}>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={user?.photo || userPlaceholderImage}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection className="sm:hidden" showDivider>
              <DropdownItem key="create" textValue="Create">
                <Button as={NavLink} fullWidth radius="none" to="e/create" variant="flat">
                  Create
                </Button>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection className="sm:hidden" showDivider>
              <DropdownItem
                key="events"
                onPress={() => navigate('browse')}
                textValue="Browse Events"
              >
                Browse Events
              </DropdownItem>
            </DropdownSection>
            <DropdownSection showDivider>
              <DropdownItem
                key="events"
                onPress={() => navigate('events')}
                textValue="My Events"
              >
                My Events
              </DropdownItem>
              <DropdownItem
                key="profile"
                onPress={() => navigate(`user/${session?.user?.id}`)}
                textValue="My Profile"
              >
                My Profile
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem color="danger" key="logout" textValue="Log Out">
                <Form action="/auth/signout" method="post">
                  <Button
                    className="m-0 min-w-min w-min h-min bg-transparent p-0"
                    type="submit"
                  >
                    Sign Out
                  </Button>
                </Form>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
