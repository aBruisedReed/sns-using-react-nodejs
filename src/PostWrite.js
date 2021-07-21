import React, { useState } from 'react';
import axios from 'axios';
import { updateList } from './PostList';


function PostWrite() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('kimjjjinhyeok');

  const writePost = async () => {
    await axios.post('http://localhost:3002/api/posts', { author, content });
    setContent('');
    updateList();
  };

  const onTextareaChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div>
      <img src="" alt="" />
      <input type="text" value={author} readOnly />
      <textarea onChange={onTextareaChange} value={content} placeholder="Enter your data..." id="" name="" cols="30" rows="10"></textarea>
      <button onClick={writePost}>Post</button>
    </div>
  );
}

export default PostWrite;
