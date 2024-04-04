import { Form, NavLink, useLocation, useNavigate, useParams } from '@remix-run/react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  cn,
} from '@nextui-org/react';

import { FilmIcon } from './Icons';
import { userPlaceholderImage } from '~/assets';
import type { User } from '~/models/user.server';

/**
 * Navigation Bar for the entire app.
 * @param user The currently signed in User
 */
export default function NavBar({ user }: { user: User | null }) {
  const navigate = useNavigate();

  const params = useParams();
  const onEventPage = params.eventId != null;

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar
      className={cn(onEventPage && 'bg-transparent')}
      isBlurred={!onEventPage}
      maxWidth="full"
    >
      <NavbarBrand as={NavLink} onClick={() => navigate('/')}>
        <FilmIcon classNames="mr-2" />
        <p className="max-sm:hidden text-inherit font-bold uppercase">Screen Patron</p>
        <div className="sm:hidden flex flex-col">
          <p className="leading-4 text-md font-bold uppercase">Screen</p>
          <p className="leading-4 text-md font-bold uppercase">Patron</p>
        </div>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarItem>
          <NavLink
            className={cn('max-sm:hidden', currentPath != '/signin' && 'mr-2')}
            to="browse"
          >
            Browse Events
          </NavLink>
          <NavLink
            className={cn('sm:hidden', currentPath != '/signin' && 'mr-2')}
            to="browse"
          >
            Browse
          </NavLink>
        </NavbarItem>
        <NavbarItem
          className={cn(
            'max-sm:hidden',
            (currentPath === '/create' || currentPath === '/signin') && 'hidden',
          )}
        >
          <Button
            as={NavLink}
            className="bg-primary mr-2"
            radius="none"
            to="create"
            variant="flat"
          >
            Create
          </Button>
        </NavbarItem>
        <NavbarItem className={cn((user || currentPath === '/signin') && 'hidden')}>
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
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className={cn('transition-transform', !user && 'hidden')}
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={user?.photo || userPlaceholderImage}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection className="sm:hidden" showDivider>
              <DropdownItem key="create" textValue="Create">
                <Button
                  as={NavLink}
                  className="bg-primary"
                  fullWidth
                  radius="none"
                  to="create"
                  variant="flat"
                >
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
                onPress={() => navigate(`user/${user?.id}`)}
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
