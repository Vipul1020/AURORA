import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, Center } from '@mantine/core';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader />
            </Center>
         );
    }

    if (!isAuthenticated) {
        console.log("ProtectedRoute (Context): Not authenticated, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    const isAuthorized = allowedRoles ? (user && allowedRoles.includes(user.role)) : true;

    if (!isAuthorized) {
        console.log(`ProtectedRoute (Context): Not authorized (Role: ${user?.role}), redirecting to /`);
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
export default ProtectedRoute;