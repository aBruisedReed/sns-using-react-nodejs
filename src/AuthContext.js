import React, { useReducer, useContext, createContext, useEffect } from 'react';
import qs from 'qs';
import jwt from 'jwt-decode';

const initialState = {
  authenticated: false,
  token: null,
  userInfo: null,
};

function authReducer(state, action) {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, token: action.token, authenticated: action.authenticated, userInfo: action.userInfo };
    case 'LOGOUT':
      return initialState;
    default:
      console.log('call default in auth reducer');
      return state;
  }
}

const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if(!context) {
    throw new Error('need context provider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if(!context) {
    throw new Error('need context provider');
  }
  return context;
}

export function AuthInit({ location, history }) {
  const dispatch = useAuthDispatch();
  useEffect(() => {
    // todo: validation
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    if(!query.t) return null;
    dispatch({ type: 'LOGIN', token: query.t, authenticated: true, userInfo: jwt(query.t) });
    history.push('/');
  }, []);
  return null;
}

export function getName(authState) {
  const name = !authState.userInfo ? 'noname' : authState.userInfo.name; 
  return name;
}
