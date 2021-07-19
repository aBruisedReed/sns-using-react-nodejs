import Login from './Login';
import PostWrite from './PostWrite';
import PostList from './PostList';
import { PostProvider } from './PostContext';

function App() {
  return (
    <PostProvider>
      <Login></Login>
      <PostWrite></PostWrite>
      <PostList></PostList>
    </PostProvider>
  );
}

export default App;
