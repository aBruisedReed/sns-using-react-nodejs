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
  displayName: '유현덕',
  image: 'https://picjumbo.com/wp-content/uploads/man-washing-white-car-in-a-self-service-car-wash-free-photo-1080x720.jpg'
  },
  {
    id: '123456789012345678112',
    displayName: '조맹덕',
    image: 'https://picjumbo.com/wp-content/uploads/welcoming-seljalandsfoss-waterfall-1080x737.jpg'
  },
  {
    id: '123456789012345678113',
    displayName: '관운장',
    image: 'https://picjumbo.com/wp-content/uploads/woman-riding-a-bicycle-and-wearing-a-helmet-free-photo-1080x1620.jpg'
  },
  {
    id: '123456789012345678114',
    displayName: '장익덕',
    image: 'https://picjumbo.com/wp-content/uploads/man-standing-on-pragues-charles-bridge-in-sepia-tone-1080x720.jpg'
  },
  {
    id: '123456789012345678115',
    displayName: '조자룡',
    image: 'https://picjumbo.com/wp-content/uploads/backcountry-skier-in-norway-1080x1620.jpg'
  }];

function DevTool() {
  const handleLogin = (info) => {
    return async () => {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login/dev`, {user: info });
      // console.log(res.data);
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
