import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useUserState, useUserDispatch, getUser } from './UserContext';
import { useAuthState } from './AuthContext';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { Loading } from './CommonContext';
import DevTool from './DevTool';

const UserListDiv = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & * {
    display: flex;
  }

  .wrap-item {
    background-color: ${props=>props.theme.palette.white};
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 18px;
  }
  .wrap-img {
    width: 205px;
    height: 205px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
  .wrap-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .wrap-name {
    // justify-content: center;
  }
  .name {
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    margin: 6px 12px;
    margin-top: 15px;
  }
  .name:hover {
    text-decoration: underline;
  }
  .chat {
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 36px;
    margin: 6px 12px;
    margin-bottom: 15px;
    border-radius: 10px;
    background-color: ${props=>props.theme.palette.paleBlue};
    color: ${props=>props.theme.palette.blue};
  }
  .chat:hover {
    background-color: ${props=>props.theme.palette.lightGray};
  }
  .chat:active {
    background-color: ${props=>props.theme.palette.lightDarkGray};
  }
  .chat.me {
    cursor: not-allowed;
    color: ${props=>props.theme.palette.gray};
    background: ${props=>props.theme.palette.lightGray};
  }
`;

function UserList() {
  const userState = useUserState();
  const dispatch = useUserDispatch();
  const { data, loading, error } = userState.userList;
  
  const fetch = () => {
    getUser(dispatch); return;
  };

  useEffect(() => {
    fetch();
  }, []);

  if(loading || !data) {
    return <Loading />
  }
  if(error) {
    return <div>Error occur{error}</div>
  }
  return (
    <UserListDiv>
      {data.map((user) => {
        return (<UserItem key={user.id} data={user} />)
      })}
      <DevTool />
    </UserListDiv>
  );
}

function UserItem({ data }) {
  const authState = useAuthState();
  const { id, name, image } = data;
  const history = useHistory();

  const [isMe, setIsMe] = useState(false);
  useEffect(() => {
    if(authState.userInfo !== null && authState.userInfo.id === id) {
      setIsMe(true);
    }
  }, []);

  const toUserPosts = () => {
    history.push(`/users/${id}`)
  };

  return (
    <div className="wrap-item">
      <div className="wrap-img" onClick={toUserPosts}>
        {image ? 
          <img src={image} alt="profile" /> :
          <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile"/>
        }
      </div>
      <div className="wrap-name">
        <div className="name" onClick={toUserPosts}>{name}</div>
      </div>
    {isMe ?
      <div className="chat btn me">
        <div className="wrap-icon"><HiOutlineChatAlt2 /></div>
        <div className="text-chat">메세지 보내기</div>
      </div>
      :
      <div className="chat btn">
        <div className="wrap-icon"><HiOutlineChatAlt2 /></div>
        <div className="text-chat">메세지 보내기</div>
      </div>
    }
    </div>
  );
}

export default UserList;
