import React, { createContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import {useNavigate} from 'react-router-dom'
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const auth = getAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { 
        const unsubcribed = auth.onIdTokenChanged((user) => {
          console.log('[From AuthProvider]', { user });
          if(user?.uid) {
            setUser(user);
            localStorage.setItem('accessToken', user.accessToken);
            setIsLoading(false);
            return;
          }
          // reset user info
          setIsLoading(false);
          setUser({});
          localStorage.clear();
          navigate('/login');
        });
    
        return () => {
          unsubcribed();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [auth]);
    
      return (
        <AuthContext.Provider value={{ user, setUser }}>
          {isLoading ? <CircularProgress /> : children}
        </AuthContext.Provider>
      );
}