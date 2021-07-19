import React, { useState } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';
import { refresh } from './PostList';

const writePost = async (dummy, { author, content }) => {
  //  왜 인지 모르겠는데 첫 번째 인자로 빈 배열이 날아온다. 
  const res = await axios.post('http://localhost:3002/api/write', { author, content });
  return res.data;
};

function PostWrite() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Kim Jin Hyeok');
  const { res, error, isLoading, run } = useAsync({ deferFn: writePost, author, content });

  const writeSubmit = () => {
    if(content === '') return;
    run();
    setContent('');
    refresh();
  };

  const onTextareaChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div>
      <img src="" alt="" />
      <input type="text" value={author} readOnly />
      <textarea onChange={onTextareaChange} value={content} placeholder="Enter your data..." id="" name="" cols="30" rows="10"></textarea>
      <button onClick={writeSubmit}>Post</button>
    </div>
  );
}

export default PostWrite;
