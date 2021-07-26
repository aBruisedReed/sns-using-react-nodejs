import React, { useContext, useState } from 'react';
import PostWrite from './PostWrite';
import PostList from './PostList';
import styled, { ThemeContext } from 'styled-components';
import { IoMdImages } from 'react-icons/io';

// PostList, PostWrite 등의 내용물도 여기서 css 작성
const PostColumnBlock = styled.div`
  width: 100%;

  .column-inner {
    width: 648px;
    margin: 0 auto;
  }
  
  .post {
    padding: 12px 16px;
    width: 100%;
    background: ${props=>props.theme.palette.white};
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-top: 20px;
  }

  .post * {
    display: flex;
  }

  // top post to write
  .top {
  }

  .top .upper, .top .lower {
    width: 100%;
  }

  .top .upper {
    align-items: flex-start;
  }
  
  .top .profile {
    margin-right: 10px;
  }
  .top .wrap-img {
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid ${props=>props.theme.palette.lightGray};
  }
  .top img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
  .wrap-btn {
    align-items: center;
    background: ${props=>props.theme.palette.lightGray};
    border-radius: 40px;
    width: 600px;
    height: 40px;
    margin-bottom: 10px;
  }
  .wrap-btn:hover {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .wrap-btn:active {
    background: ${props=>props.theme.palette.lightDarkDarkGray};
  }
  .top .text-upper {
    height: 22px;
    margin-left: 10px;
    font-size: 17px;
    color: ${props=>props.theme.palette.gray};
  }
  .top .lower {
    height: 40px;
    border-top: 1px solid ${props=>props.theme.palette.lightGray}; 
    padding-top: 10px;
  } 
  .wrap-lower {
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    width: 100%;
  }
  .wrap-lower:hover {
     background: ${props=>props.theme.palette.lightGray};
  }
  .wrap-lower:active {
     background: ${props=>props.theme.palette.lightDarkGray};
  }
  .top .icon-wrap {
  }
  .text-lower {
    color:  ${props=>props.theme.palette.gray};
    font-size: 18px;
    margin-left: 10px;
    height: 18px;
  }

`;

function PostColumn() {
  const username = '김진혁'; // for test, todo: dynamic
  const theme = useContext(ThemeContext);
  const [writeToggle, setWriteToggle] = useState(false);

  const clickWrite = () => {
    setWriteToggle(true);
  };
  return (
    <PostColumnBlock>
      <div className="column-inner">
        <div className="top post"> 
          <div className="upper">
            <div className="profile">
              <div className="wrap-img">
                <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
              </div>
            </div>
            <div className="wrap-btn btn" onClick={clickWrite}>
              <div className="text-upper">{username}님, 무슨 생각을 하고 계신가요?</div>
            </div>
          </div>
          <div className="lower">
            <div className="wrap-lower btn">
              <div className="wrap-icon"><IoMdImages size="32px" color={theme.palette.green}/></div>
              <div className="text-lower">사진 첨부하기</div>
            </div>
          </div>
        </div>
        <PostWrite visible={writeToggle} setVisible={setWriteToggle}></PostWrite>
        <PostList></PostList>
      </div>
    </PostColumnBlock>
  );
};

export default PostColumn;
