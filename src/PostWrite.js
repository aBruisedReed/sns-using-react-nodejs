import React, { useState } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';

function PostWrite() {
  const [postData, setPostData] = useState(null);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Kim Jin Hyeok');

  const writePost = async () => {
    setPostData({
      author: author,
      content: content
    });
    const res = await axios.post('http://localhost:3002/api/write', postData);
    console.log('res', res);
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
