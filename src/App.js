import './App.css';
import AsyncTest from './AsyncTest';
import Login from './Login';
import PostWrite from './PostWrite';
import PostList from './PostList';

function App() {
  return (
    <div>
      <Login></Login>
      <PostWrite></PostWrite>
      <PostList></PostList>
      <AsyncTest></AsyncTest>
    </div>
  );
}

export default App;
