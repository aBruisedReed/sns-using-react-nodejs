import React, { useContext, useState } from 'react';
import PostWrite from './PostWrite';
import PostList from './PostList';
import UserList from './UserList';
import { Route } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { IoMdImages } from 'react-icons/io';
import { useAuthState, getName, getUserImg } from './AuthContext';

const PostColumnBlock = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-bottom: 30px;

  .column-inner {
    width: 648px;
    margin: 0 auto;
  }
  
  .post {
    display: flex;
    flex-direction: column;
    padding: 12px 16px 0px 12px;
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
    padding-bottom: 12px;
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

  //post list, item
  .post-item .wrap-img {
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid ${props=>props.theme.palette.lightGray};
  }
  .post-item img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
  .post-item .wrap-author { 
    flex: 1;
    flex-direction: column;
    margin-left: 10px;
    justify-content: center;
  }
  .post-item .wrap-author, .post-item .wrap-img {
    cursor: pointer;
  }
  .post-item .author {
    font-weight: bold;
  }
  .post-item .wrap-author:hover {
    text-decoration: underline;
  }
  .post-item .date {
    font-size: 13px;
    color: ${props=>props.theme.palette.gray};
  }
  .post-item .wrap-wrap-icon {
    height: 42px;
    align-items: center;
  }
  .post-item .wrap-icon {
    height: 36px;
    width: 36px;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
  }
  .post-item .wrap-icon:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .post-item .wrap-icon:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .post-item .post-menu .btn {
    padding-right: 10px;
    border-radius: 30px;
  }
  .post-item .post-menu .btn:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .post-item .post-menu .btn:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .post-item .post-menu {
    
  }
  .post-item .post-menu .text-icon {
    align-items: center;
  }
  .post-item .post-menu .text-icon span {
    height: auto;
  }
  .post-item .middle {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .post-item .lower { 
    flex-direction: column;
  }
  .post-item .lower .info {
    padding: 10px 0;
    justify-content: space-between;
    color: ${props=>props.theme.palette.gray};
  }
  .post-item .lower .comment {
    cursor: pointer;
  }
  .post-item .lower .btns {
    border-top: 1px solid ${props=>props.theme.palette.lightDarkGray};
  }
  .post-item .lower .btns .wrap-btn {
    color: ${props=>props.theme.palette.gray};
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    margin: 0;
    background: none;
  }
  .post-item .lower .btn {
    justify-content: center;
    align-items: center;
    flex: 2;
    border-radius: 10px;
  }
  .post-item .lower .btn:hover { 
    background: ${props=>props.theme.palette.lightGray};
  }
  .post-item .lower .btn:acitve { 
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .post-item .lower .wrap-icon {
    background: none;
  }
  .post-item .lower .text {
    justify-content: center;
    align-items: center;
  }

  // cmt
  .post-item .cmt-section {
    border-top: 1px solid ${props=>props.theme.palette.lightDarkGray};
    padding: 10px 0;
    flex-direction: column;
  }
  .post-item .cmt-section .wrap-input-section {
  }
  .post-item .cmt-section .profile {
    align-items: center;
    margin-right: 10px;
  }
  .post-item .cmt-section .wrap-img {
    height: 32px;
    width: 32px;
  }
  .post-item .cmt-section img {
    height: 32px;
    width: 32px;
  }
  .post-item .cmt-section .wrap-input {
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 20px;
    padding: 8px 12px;
    background: ${props=>props.theme.palette.lightGray};
    border-radius: 36px;
  }
  .post-item .cmt-section input {
    flex: 1;
    height: 20px;
  }
  .post-item .cmt-section .wrap-cmt {
    margin-top: 10px;
  }
  .post-item .cmt-section .wrap-cmt:last-child {
    margin-bottom: 0;
  }
  .post-item .cmt-section .wrap-content {
    flex: 1;
    background: ${props=>props.theme.palette.lightGray};
    border-radius: 18px;
    align-items: center;
  }
  .post-item .cmt-section .left {
    flex-direction: column;
    flex: 1;
    padding: 8px 12px;
  }
  .post-item .cmt-section .wrap-content .name {
    font-size: 13px;
    font-weight: bold;
  }
  .post-item .cmt-section .wrap-content .date {
    font-size: 12px;
    color: ${props=>props.theme.palette.gray};
    font-weight: normal;
  }
  .post-item .cmt-section .wrap-content .content {
    font-size: 15px;
  }
  .post-item .cmt-section .del-btn {
    margin-right: 10px;
    width: 37px;
    height: 37px;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    color: ${props=>props.theme.palette.gray};
  }
  .post-item .cmt-section .del-btn:hover {
    color: ${props=>props.theme.palette.red};
  }

`;

function PostColumn() {
  const [writeToggle, setWriteToggle] = useState(false);
  const authState = useAuthState();
  const username = getName(authState);

  const clickWrite = () => {
    setWriteToggle(true);
  };
  return (
    <PostColumnBlock>
      <div className="column-inner">
        {authState.authenticated &&
        <Route path="/" exact={true} render={() => <PostTopWrite username={username} clickWrite={clickWrite} authState={authState} />} />
        }
        <PostWrite visible={writeToggle} setVisible={setWriteToggle} isModify={false}></PostWrite>
        <Route path="/" exact={true} render={() => <PostList type={'all'} />} />
        <Route path="/users/:id/" exact={true} render={({ match }) => <PostList match={match} type={'user'} />} />
        <Route path="/users" exact={true} component={UserList}/>
      </div>
    </PostColumnBlock>
  );
};

function PostTopWrite({ clickWrite, username, authState }) {
  const userImg = getUserImg(authState);
  const theme = useContext(ThemeContext);
  return (
    <div className="top post"> 
      <div className="upper">
        <div className="profile">
          <div className="wrap-img">
            {userImg ? 
            <img src={userImg} alt="profile" /> :
            <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
            }
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
  );
}

export default PostColumn;
