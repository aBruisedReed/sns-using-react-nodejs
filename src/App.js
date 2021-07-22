import PostWrite from './PostWrite';
import PostList from './PostList';
import { PostProvider } from './PostContext';
import Topbar from './Topbar';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

// todo: dark mode, light mode 구현 
const theme = {
  palette: {
    white: '#FFFFFF',
    lightGray: '#F0F2F5',
    gray: '#65676B',
    paleBlue: '#E7F3FF',
    blue: '#0771ED',
    black: '#050505'
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
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Topbar>
      </Topbar>
      <PostProvider>
        <PostWrite></PostWrite>
        <PostList></PostList>
      </PostProvider>
    </ThemeProvider>
  );
}

export default App;
