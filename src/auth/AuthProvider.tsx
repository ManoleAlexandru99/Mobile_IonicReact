import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { login as loginApi } from './authApi';
import { Storage } from "@capacitor/core";

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  logout?: LogoutFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallback, [])
  useEffect(authenticationEffect, [pendingAuthentication]);
  const value = { isAuthenticated, login,logout, isAuthenticating, authenticationError, token };
  //localStorage.set("token", "")
  log('render');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function loginCallback(username?: string, password?: string): void {
    log('login');
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password
    });
  }

  function logoutCallback(): void {
    log('logout');
    setState({
        ...state,
        token: '',
        isAuthenticated: false,
    });

    (async () => {
         await Storage.clear();
    })();
}

   function authenticationEffect() {

    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    }

    async function authenticate() {


      var token = await Storage.get({ key: 'token' });
      console.log(token.value)
      
      if(token.value){
        setState({
            ...state,
            token: token.value,
            pendingAuthentication: false,
            isAuthenticated: true,
            isAuthenticating: false,
        });
      }
      

      if (!pendingAuthentication) {
        log('authenticate, !pendingAuthentication, return');
        return;
      }


      try {
        log('authenticate...');
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        const { token } = await loginApi(username, password);
        console.log("Token= ",token)
        if (canceled) {
          return;
        }
        log('authenticate succeeded');
        await Storage.set({
                          key: 'token',
                          value: token
                     });
        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log('authenticate failed');
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};