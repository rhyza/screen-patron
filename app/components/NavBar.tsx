import { NavLink, useLocation, useNavigate } from '@remix-run/react';
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
import { signOut } from '~/models/user.server';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = true; // testing use only

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
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
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
                onClick={() => navigate('browse')}
                textValue="Browse Events"
              >
                Browse Events
              </DropdownItem>
            </DropdownSection>
            <DropdownSection showDivider>
              <DropdownItem
                key="events"
                onClick={() => navigate('events')}
                textValue="My Events"
              >
                My Events
              </DropdownItem>
              <DropdownItem
                key="profile"
                onClick={() => navigate('user/test')}
                textValue="My Profile"
              >
                My Profile
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem key="logout" color="danger" textValue="Log Out">
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
