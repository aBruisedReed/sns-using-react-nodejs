import React, { useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import { PostProvider } from './PostContext';
import { UserProvider } from './UserContext';
import { AuthProvider, AuthInit } from './AuthContext';
import { SocketContext, socket } from './socket';
import Topbar from './Topbar';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import PostColumn from './PostColumn';
import moment from 'moment';
import 'moment/locale/ko';
import { ScrollToTop } from './CommonContext';
import Chat, { ChatProvider } from './Chat';

const GlobalStyle = createGlobalStyle`
  body {
    padding-top: 56px;
    background: ${props=>props.theme.palette.lightGray};

    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    border: none;
    outline: none;
    background: transparent;
  }
  textarea {
    border: none;
    overflow: auto;
    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none; /*remove the resize handle on the bottom right*/

    padding: 0;
   }   
  .btn {
    cursor: pointer;
  }
  .hidden {
    display: none !important
    ;
  }
`;

function App() {
  moment.locale('ko');
  const light = {
    palette: {
      white: '#FFFFFF',
      lightGray: '#F0F2F5',
      lightDarkGray: '#E4E6EB',
      lightDarkDarkGray: '#C1C6D1',
      gray: '#65676B',
      paleBlue: '#E7F3FF',
      blue: '#0771ED',
      darkBlue: '#196ED8',
      darkDarkBlue: '#1354A5',
      lightBlue: '#E6F2FE',
      black: '#050505',
      red: '#F12849',
      green: '#45BD62',
    }
  }; 
  const dark = {
    palette: {
      white: '#252526',
      lightGray: '#3A3B3D',
      lightDarkGray: '#5A5C5E',
      lightDarkDarkGray: '#97999B',
      gray: '#B0B3B8',
      paleBlue: '#263A59',
      blue: '#0771ED',
      darkBlue: '#196ED8',
      darkDarkBlue: '#1354A5',
      lightBlue: '#E6F2FE',
      black: '#E4E6EB',
      red: '#F12849',
      green: '#45BD62',
    }
  }; 
  const [theme, setTheme] = useState(light);
  const [darkMode, setDarkMode] = useState(false); // topbardropdown 에서 dark 모드 스위치를 위한 state
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // dark mode
      setDarkMode(true);
      setTheme(dark);
    } else {
      setDarkMode(false);
      setTheme(light);
    }
  }, []);
  useEffect(() => {
    if(darkMode) {
      setTheme(dark);
    } else {
      setTheme(light);
    }
  }, [darkMode]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SocketContext.Provider value={socket}>
        <AuthProvider>
          <ChatProvider>
            <ScrollToTop>
              <Route path="/" exact={true} component={AuthInit} />
              <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
              <Chat />
              <UserProvider>
                <PostProvider>
                  <PostColumn />
                </PostProvider>
              </UserProvider>
            </ScrollToTop>
          </ChatProvider>
        </AuthProvider>
        </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
