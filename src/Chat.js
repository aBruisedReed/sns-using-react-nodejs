import React, { useState, useEffect, useRef, createContext, useReducer, useContext } from 'react';
import styled from 'styled-components';
import { useAuthState } from './AuthContext';
import socketio from 'socket.io-client';

const ChatDiv = styled.div`
  position: fixed;
  background: lightblue;
  top: 100px;
  left: 100px;

`;

function Chat() {
  const authState = useAuthState();
  const [socket, setSocket] = useState(null);
  const [receive, setReceive] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    console.log('authState', authState);
    if(!authState.userInfo) return;
    setSocket(authState.userInfo.socket);
    if(!socket) return;
    console.log('on receive');
    socket.on('receive msg', (data) => {
      console.log('receive');
      setReceive(receive.concat(
        `${data.fromName}:${data.msg}`
      ));
    });
  }, [authState, socket]);
  const onMsgChange = (e) => {
    setMsg(e.target.value);
  };
  const send = () => {
    console.log('socket', socket);
    socket.emit('send msg', {
      fromId: authState.userInfo.id,
      toId: state.who,
      msg: msg
    });
  };
  const [state, dispatch] = useChatContext();

  if(!state.visible) return null;
  return (
    <ChatDiv>
      <div>{receive}</div>
      <input type="text" value={msg} onChange={onMsgChange}/>
      <button onClick={send}>send</button>
    </ChatDiv>
  );
}

const initialState = {
  who: null,
  visible: false
};

const chatReducer = (state, action) => {
  switch(action.type) {
    case 'CHAT_ON': 
      return { who: action.who, visible: action.visible };
    case 'CHAT_OFF':
      return initialState;
    default:
      console.log('call default');
      return state;
  }
};

const ChatStateContext = createContext(null);
const ChatDispatchContext = createContext(null);

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatStateContext.Provider value={state}>
      <ChatDispatchContext.Provider value={dispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
}

export function useChatContext() {
  const state = useContext(ChatStateContext);
  const dispatch = useContext(ChatDispatchContext);
  if(!state || !dispatch) {
    throw new Error('need context provider');
  }
  return [state, dispatch];
}

export function chatOn(dispatch, who) {
  dispatch({ type: 'CHAT_ON', who: who, visible: true });
}
export function chatOff(dispatch, who) {
  dispatch({ type: 'CHAT_ON', who: who, visible: true });
}

export function initSocket(userId, userName) {
  const socket = socketio.connect('http://localhost:3002');
  socket.emit('init', {
    userId,
    userName
  });
  return socket;
}

export default Chat;
