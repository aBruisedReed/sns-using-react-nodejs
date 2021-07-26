import { PostProvider } from './PostContext';
import Topbar from './Topbar';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import PostColumn from './PostColumn';

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
  .btn {
    cursor: pointer;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Topbar>
      </Topbar>
      <PostProvider>
        <PostColumn>
        </PostColumn>
      </PostProvider>
    </ThemeProvider>
  );
}

export default App;
