import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProviderPrivateRoute({ allowedRoles }) {
    const { currentUser } = useSelector(state => state.user);

    // Check if the user is logged in and has one of the allowed roles
    const userHasRequiredRole = currentUser && allowedRoles.includes(currentUser.role);

    return userHasRequiredRole ? <Outlet/> : <Navigate to='/unauthorized'/>;
}