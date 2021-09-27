import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DevToolBlock = styled.div`
  display: absolute;
  bottom: 10px;
`;

const UsersInfo = [{
  id: '123456789012345678111',
  displayName: '교강용',
  image: 'https://picjumbo.com/wp-content/uploads/man-washing-white-car-in-a-self-service-car-wash-free-photo-1080x720.jpg'
  },
  {
    id: '123456789012345678112',
    displayName: '황산',
    image: 'https://picjumbo.com/wp-content/uploads/black-styled-minimal-office-things-room-for-text-2210x1473.jpg'
  },
  {
    id: '123456789012345678113',
    displayName: '마영웅',
    image: 'https://picjumbo.com/wp-content/uploads/woman-riding-a-bicycle-and-wearing-a-helmet-free-photo-1080x1620.jpg'
  },
  {
    id: '123456789012345678114',
    displayName: '강건마',
    image: 'https://picjumbo.com/wp-content/uploads/man-standing-on-pragues-charles-bridge-in-sepia-tone-1080x720.jpg'
  },
  {
    id: '123456789012345678115',
    displayName: '전사독',
    image: 'https://picjumbo.com/wp-content/uploads/backcountry-skier-in-norway-1080x1620.jpg'
  }];

function DevTool() {
  const handleLogin = (info) => {
    return async () => {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login/dev`, {user: info });
      window.open(`${process.env.REACT_APP_CLIENT_URL}?t=${res.data}`, "_self");
    }
  }
  return (
    <DevToolBlock>
      {
        UsersInfo.map(info => ( 
          <button key={info.id} onClick={handleLogin(info)}>{info.displayName}</button>
        ))
      }
    </DevToolBlock>
  );
}

export default DevTool;
