import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

const initialState = {
  userList: {
    loading: false,
    data: null,
    error: null
  },
};

const loadingState = {
  loading: true,
  data: null,
  error: null
};

const success = data => ({
  loading: false,
  data,
  error: null
});

const error = error => ({
  loading: false,
  data: null,
  error
});

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'GET_USER': 
      return {
        ...state,
        userList: loadingState 
      };
    case 'GET_USER_SUC': 
      return {
        ...state,
        userList: success(action.data) 
      };
    case 'GET_USER_ERR': 
      return {
        ...state,
        userList: error(action.error) 
      };
    case 'GET_USER_CLEAN':
      return initialState;
    default: 
      throw new Error('Unhandled action type: '+action.type);
  };
}

const UserStateContext = createContext(null);
const UserDispatchContext = createContext(null);

// state, dispatch 두 가지 컨텍스트 사용을 위한 통합 provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// 다른 컴포넌트에서 쉬운 사용을 위한 custom hook
export function useUserState() {
  const context = useContext(UserStateContext);
  if(!context) {
    throw new Error('need context provider');
  }
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if(!context) {
    throw new Error('need context porivder');
  }
  return context;
}

export async function getUser(dispatch) {
  dispatch({ type: 'GET_USER' });
  try {
    const res = await axios.get('http://localhost:3002/api/users');
    dispatch({ type: 'GET_USER_SUC', data: res.data });
  } catch (e) {
    dispatch({ type: 'GET_USER_ERR', error: e });
  }
}
