import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

const initialState = {
  postList: {
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

function postReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'GET_POST': 
      return {
        ...state,
        postList: loadingState 
      };
    case 'GET_POST_SUC': 
      return {
        ...state,
        postList: success(action.data) 
      };
    case 'GET_POST_ERR': 
      return {
        ...state,
        postList: error(action.error) 
      };
    case 'GET_POST_CLEAN':
      return initialState;
    default: 
      throw new Error('Unhandled action type: '+action.type);
  };
}

const PostStateContext = createContext(null);
const PostDispatchContext = createContext(null);

// state, dispatch 두 가지 컨텍스트 사용을 위한 통합 provider component
export function PostProvider({ children }) {
  const [state, dispatch] = useReducer(postReducer, initialState);
  return (
    <PostStateContext.Provider value={state}>
      <PostDispatchContext.Provider value={dispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostStateContext.Provider>
  );
}

// 다른 컴포넌트에서 쉬운 사용을 위한 custom hook
export function usePostState() {
  const context = useContext(PostStateContext);
  if(!context) {
    throw new Error('need context porivder');
  }
  return context;
}

export function usePostDispatch() {
  const context = useContext(PostDispatchContext);
  if(!context) {
    throw new Error('need context porivder');
  }
  return context;
}

export async function getPost(dispatch) {
  dispatch({ type: 'GET_POST' });
  try {
    const res = await axios.get('http://localhost:3002/api/posts');
    dispatch({ type: 'GET_POST_SUC', data: res.data });
  } catch (e) {
    dispatch({ type: 'GET_POST_ERR', error: e });
  }
}

export async function getPostUser(dispatch, id) {
  dispatch({ type: 'GET_POST' });
  try {
    const res = await axios.get(`http://localhost:3002/api/users/${id}/posts`);
    dispatch({ type: 'GET_POST_SUC', data: res.data });
  } catch (e) {
    dispatch({ type: 'GET_POST_ERR', error: e });
  }
}

export async function getPostSearch(dispatch, keyword) {
  dispatch({ type: 'GET_POST' });
  try {
    const res = await axios.get(`http://localhost:3002/api/posts?keyword=${keyword}`);
    dispatch({ type: 'GET_POST_SUC', data: res.data });
  } catch (e) {
    dispatch({ type: 'GET_POST_ERR', error: e });
  }
}
