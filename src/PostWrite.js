import React, { useState, useContext } from 'react';
import axios from 'axios';
import { updateList } from './PostList';
import styled, { ThemeContext } from 'styled-components';
import { VscChromeClose } from 'react-icons/vsc';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const PostWriteBlock = styled.div`
  background: ${props=>props.theme.palette.white};
  width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
  border-radius: 10px;

  & * {
    display: flex;
  }
  .title {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid ${props=>props.theme.palette.lightGray};
  }
  .title .title-text {
    font-weight: bold;
    font-size: 22px;
    margin-right: 10px;
  }
  .title .close-btn {
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    border-radius: 40px;
  }
  .title .close-btn:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .title .close-btn:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
`;

function PostWrite({ visible, setVisible }) {
  const theme = useContext(ThemeContext);
  const [content, setContent] = useState('');
  const author = 'kimjjjinhyeok'; // todo: make it dynamic

  const writePost = async () => {
    await axios.post('http://localhost:3002/api/posts', { author, content });
    setContent('');
    updateList();
  };

  // todo: 글자 수 일정 수 넘어가면 글자 축소
  const onTextareaChange = (e) => {
    setContent(e.target.value);
  };
  
  const clickBg = () => {
    setVisible(false);
  };

  if(!visible) return null;
  return (
    <DarkBackground onClick={clickBg}>
      <PostWriteBlock>
        <div className="title">
          <div className="title-text">게시물 작성하기</div>
          <div className="close-btn btn"><VscChromeClose size="25px" color={theme.palette.gray} /></div>
        </div>
        <img src="" alt="" />
        <input type="text" value={author} readOnly />
        <textarea onChange={onTextareaChange} value={content} placeholder="Enter your data..." id="" name="" cols="30" rows="10"></textarea>
      <button onClick={writePost}>Post</button>
      </PostWriteBlock>
    </DarkBackground>
  );
}

export default PostWrite;
