    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import { ADMIN_UID } from '../config';

    function ProtectedRoute({ children }) {
      const { currentUser } = useAuth();

      // 1. If we're still checking for a user, show nothing (or a loader)
      // This is a check in case the parent component hasn't finished loading yet.
      if (currentUser === undefined) {
          return null;
      }
      
      // 2. If no user is logged in, OR if the logged-in user is NOT the admin,
      //    redirect them to the homepage.
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        return <Navigate to="/" />;
      }

      // 3. If the checks pass, render the component that was passed in (the dashboard).
      return children;
    }

    export default ProtectedRoute;
    
