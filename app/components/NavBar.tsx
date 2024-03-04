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

export default function NavBar() {
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
          <Button
            as={NavLink}
            className={cn(
              'bg-primary max-sm:hidden',
              location.pathname === '/e/create' ? 'hidden' : '',
            )}
            radius="none"
            to="e/create"
            variant="flat"
          >
            Create
          </Button>
        </NavbarItem>
        <NavbarItem>
          <NavLink className="max-sm:hidden mx-4" to="browse">
            Browse Events
          </NavLink>
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
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
