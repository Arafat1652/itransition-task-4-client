import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

    // Redirect to login page if user is not logged in or is blocked
    if (!user || user.status === 'blocked') {
        return <Navigate to="/" replace />;
    }

    return children; // Render the child routes
};

export default PrivateRoute;