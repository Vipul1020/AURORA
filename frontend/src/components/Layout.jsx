import React, { useEffect } from 'react';
import { AppShell, Burger, Group, Title, Button, Text, NavLink, Divider, Loader, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IconHome2, IconGauge, IconUserCircle, IconClipboardList, IconPlus, IconLogin, IconUserPlus, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
        if (mobileOpened) { toggleMobile(); }
    };

    const navLinks = [
        { icon: IconHome2, label: 'Home', path: '/', requiredAuth: false },
        ...(isAuthenticated && user?.role === 'candidate' ? [{ icon: IconGauge, label: 'My Dashboard', path: '/candidate-dashboard', requiredAuth: true }] : []),
        ...(isAuthenticated && user?.role === 'recruiter' ? [{ icon: IconGauge, label: 'My Dashboard', path: '/recruiter-dashboard', requiredAuth: true }] : []),
        ...(isAuthenticated && user?.role === 'recruiter' ? [{ icon: IconPlus, label: 'Post New Job', path: '/post-job', requiredAuth: true, allowedRoles: ['recruiter'] }] : []),
        { icon: IconUserCircle, label: 'My Profile', path: '/profile', requiredAuth: true },
        ...(isAuthenticated && user?.role === 'candidate' ? [{ icon: IconClipboardList, label: 'My Applications', path: '/my-applications', requiredAuth: true, allowedRoles: ['candidate'] }] : []),
    ];

    const visibleNavLinks = navLinks.filter(link => {
        if (link.requiredAuth && !isAuthenticated) return false;
        if (link.allowedRoles && (!user || !link.allowedRoles.includes(user.role))) return false;
        return true;
    });

    if (isLoading) {
        return ( <Center style={{ height: '100vh' }}><Loader /></Center> );
    }

    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            header={{ height: 60 }}
            navbar={{ width: { sm: 200, lg: 250 }, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
            styles={(theme) => ({
                main: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    minHeight: 'calc(100vh - var(--mantine-header-height, 60px))',
                 },
                navbar: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                 },
                 header: {
                     backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                     borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                 }
            })}
        >
            <AppShell.Header>
                 <Group sx={{ height: '100%' }} px="md" justify="space-between">
                     <Group>
                         <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                         <Title order={3} component={Link} to={isAuthenticated ? (user?.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard') : '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            AI Job Portal
                         </Title>
                     </Group>
                     <Group visibleFrom="xs" spacing="md">
                        {isAuthenticated && user ? (
                            <>
                                <Text size="sm" mr="xs">Welcome, {user.firstName || user.email}</Text>
                                <Button variant="light" onClick={handleLogout} size="sm">
                                     <Group spacing="xs" noWrap><IconLogout size="1rem" stroke={1.5} /><Text span>Logout</Text></Group>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="default" component={Link} to="/login" size="sm">
                                     <Group spacing="xs" noWrap><IconLogin size="1rem" stroke={1.5} /><Text span>Log in</Text></Group>
                                </Button>
                                <Button component={Link} to="/register" size="sm">
                                    <Group spacing="xs" noWrap><IconUserPlus size="1rem" stroke={1.5} /><Text span>Register</Text></Group>
                                </Button>
                            </>
                        )}
                     </Group>
                 </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                 {visibleNavLinks.map((link) => (
                     <NavLink
                        key={link.label} label={link.label}
                        icon={<link.icon size="1rem" stroke={1.5} />}
                        component={Link} to={link.path}
                        active={location.pathname === link.path}
                        onClick={toggleMobile}
                    />
                 ))}
                 <Divider my="sm" />
                 {!isAuthenticated ? (
                     <>
                        <NavLink label="Login" icon={<IconLogin size="1rem" stroke={1.5}/>} component={Link} to="/login" active={location.pathname === '/login'} onClick={toggleMobile}/>
                        <NavLink label="Register" icon={<IconUserPlus size="1rem" stroke={1.5}/>} component={Link} to="/register" active={location.pathname === '/register'} onClick={toggleMobile}/>
                     </>
                 ) : (
                     <NavLink label="Logout" icon={<IconLogout size="1rem" stroke={1.5}/>} onClick={handleLogout} />
                 )}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
export default Layout;