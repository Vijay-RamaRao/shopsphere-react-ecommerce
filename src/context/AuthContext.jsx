    import React, { createContext, useState, useEffect, useContext } from 'react';
    import { onAuthStateChanged } from 'firebase/auth';
    import { auth } from '../firebase'; 

    const AuthContext = createContext();

    // Custom hook to make it easy to use the auth context in other components
    export function useAuth() {
      return useContext(AuthContext);
    }

    export function AuthProvider({ children }) {
      const [currentUser, setCurrentUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // onAuthStateChanged is a listener from Firebase.
        // It fires once when the app loads, and again any time a user signs in or out.
        const unsubscribe = onAuthStateChanged(auth, user => {
          setCurrentUser(user); // user will be null if logged out, or a user object if logged in
          setLoading(false);
        });

        // Cleanup the listener when the component is no longer on the screen
        return unsubscribe;
      }, []);

      const value = {
        currentUser
      };

      return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
    }
    
