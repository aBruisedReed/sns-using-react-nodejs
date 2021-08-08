import React, { useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { PostProvider } from './PostContext';
import { AuthProvider, AuthInit } from './AuthContext';
import Topbar from './Topbar';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import PostColumn from './PostColumn';
import moment from 'moment';
import 'moment/locale/ko';
// todo: del this
import DevTool from './DevTool';


// todo: dark mode, light mode 구현 
const theme = {
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

const GlobalStyle = createGlobalStyle`
  body {
    padding-top: 56px;
    background: #F0F2F5;
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
   }   
  .btn {
    cursor: pointer;
  }
`;

function App() {
  moment.locale('ko');
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Route path="/" exact={true} component={AuthInit} />
        <Topbar />
        <PostProvider>
          <PostColumn />
        </PostProvider>
    <DevTool />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
