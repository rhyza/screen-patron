import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import {
  Avatar,
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger,
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
} from '@nextui-org/react';
import { InstagramIcon } from './Icons';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Navbar maxWidth='full'>
      <NavbarBrand as={NavLink} onClick={() => navigate('/')}>
        <InstagramIcon />
        <p className='font-bold text-inherit ml-2'>ACME</p>
      </NavbarBrand>

      <NavbarContent as='div' justify='end'>
        <NavbarItem>
          <Button
            as={NavLink}
            className={location.pathname === '/screening/create'  ? 'hidden' : ''}
            radius='none'
            to='/screening/create'
            variant='flat'
          >
            Create
          </Button>
        </NavbarItem>
        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform'
              color='secondary'
              name='Jason Hughes'
              size='sm'
              src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
            />
          </DropdownTrigger>
          <DropdownMenu aria-label='Profile Actions' variant='flat'>
            <DropdownSection showDivider>
              <DropdownItem key='create'>
                <Button
                  as={NavLink}
                  fullWidth
                  radius='none'
                  to='/screening/create'
                  variant='flat'
                >
                  Create
                </Button>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection showDivider>
              <DropdownItem key='profile' onClick={() => navigate('/user/1')}>My Profile</DropdownItem>
              <DropdownItem key='events' onClick={() => navigate('/screening/1')}>My Events</DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem key='logout' color='danger'>
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}