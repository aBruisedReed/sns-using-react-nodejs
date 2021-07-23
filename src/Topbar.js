import React, { useState, useContext } from 'react';
import styled, { css, keyframes, ThemeContext } from 'styled-components';
import { BsSearch, BsPeopleFill, BsPeople } from 'react-icons/bs';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FiMessageSquare } from 'react-icons/fi';
import { MdNotificationsNone } from 'react-icons/md';
import { BiDownArrow } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import TopbarDropdown from './TopbarDropdown';

// css anims
const searchIn = keyframes`
  from {
    width: 40px;
  }
  to {
    width: 250px;
  }
`;

const searchOut = keyframes`
  from {
    width: 250px;
  }
  to {
    width: 40px;
  }
`;

const TopbarBlock = styled.div`
  position: fixed;
  top: 0px; left: 0px;
  display: flex;
  width: 100%;
  height: 56px;
  background: ${props => props.theme.palette.white};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  justify-content: space-between;

  & * {
    display: flex;
  }

  .left, .center, .right {
    height: 100%;
    width: 240px;
    display: flex;
  }

  // left
  .left {
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
  }
  .left .home {
    margin-right: 10px;
  }
  .left .home img {
    height: 48px;
    width: 48px;
  }
  .left .search-wrap {
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    background-color: ${props => props.theme.palette.lightGray};
    border-radius: 50px;
  }
  .left .search-wrap.active { 
    width: 250px;
    padding-left: 15px;
    padding-right: 15px;

    animation-duration: 0.25s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    ${props => 
    {
      return props.searchDisappear ? 
      css`animation-name: ${searchOut};`
      :
      css`animation-name: ${searchIn};`
    }
    }
  }
  .left .search-wrap input {
    width:100%;
    height: 24px;
  }
  .left .search-btn {
  }
  .left .search-btn.active {
  }

  // center
  .center {
    justify-content: center;
  }
  .center .tab-wrap .active {
    border-bottom: 3px solid ${props=>props.theme.palette.blue};
  }
  .center .tab-wrap .inactive:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .center .tab-wrap .inactive:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .center .tab-wrap .btn {
    width: 120px;
    justify-content: center;
    align-items: center;
  }

  // right
  .right {
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
  }
  .right .btn {
    background: ${props=>props.theme.palette.lightGray};
    width: 40px;
    height: 40px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .right .btn:hover {
    background: ${props=>props.theme.palette.lightDarkGray};
  }
  .right .btn:active {
    background: ${props=>props.theme.palette.lightDarkDarkGray};
  }
`;

function Topbar() {
  const theme = useContext(ThemeContext);
  const history = useHistory();

  // left
  const clickHome = () => {
    // history.push('/');
    clickHomeTab();
  };
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchDisappear, setSearchDisappear] = useState(false);

  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const clickSearchActive = () => {
    setSearchVisible(true);
  };

  const focusOutSearch = () => {
    setSearchInput('');
    setSearchDisappear(true);
    setTimeout(() => {
      setSearchVisible(false);
      setSearchDisappear(false);
    }
    , 250); // close animation delay
  };
  
  // center
  const [activeTab, setActiveTab] = useState(0);

  // 추가 가능성과 가독성을 위해 분리
  const getActiveTab = (activeTab) => {
    switch(activeTab) {
      case 0: 
        return (
          <div class="tab-wrap">
            <div className="home-tab btn active" onClick={clickHomeTab}>
              <AiFillHome size="25px" color={theme.palette.blue} /> 
            </div>
            <div className="users-tab btn inactive" onClick={clickUsersTab}>
              <BsPeople size="25px" color={theme.palette.gray} /> 
            </div>
          </div>
        );
      case 1: 
        return (
          <div class="tab-wrap">
            <div className="home-tab btn inactive" onClick={clickHomeTab}>
              <AiOutlineHome size="25px" color={theme.palette.gray} /> 
            </div>
            <div className="users-tab btn active" onClick={clickUsersTab}>
              <BsPeopleFill size="25px" color={theme.palette.blue} /> 
            </div>
          </div>
        );
      default: return null;
    }
  }
  const clickHomeTab = () => {
    setActiveTab(0);
    history.push('/');
  };
  const clickUsersTab = () => {
    setActiveTab(1);
    history.push('/users');
  };

  // right
  // login check
  const [checkLogin, setCheckLogin] = useState(true);

  const [activeRightMenu, setActiveRightMenu] = useState(99);
  const defaultRightMenu = {
    msg: theme.palette.black,
    noti: theme.palette.black,
    menu: theme.palette.black
  }
  const getRightMenuColor = (menuNumber) => {
    switch(menuNumber) {
      case 0: 
        return {
          ...defaultRightMenu,
          msg: theme.palette.blue
        };
      case 1: 
        return {
          ...defaultRightMenu,
          noti: theme.palette.blue
        };
      case 2: 
        return {
          ...defaultRightMenu,
          menu: theme.palette.blue
        };
      case 99: default: 
        return defaultRightMenu;
    }
  }


  const clickMsg = () => {
    setActiveRightMenu(0);
    if(activeRightMenu === 0) {
      setActiveRightMenu(99);
    }
  }
  const clickNoti = () => {
    setActiveRightMenu(1);
    if(activeRightMenu === 1) {
      setActiveRightMenu(99);
    }
  }
  const clickMenu = () => {
    setActiveRightMenu(2);
    if(activeRightMenu === 2) {
      setActiveRightMenu(99);
    }
  }

  return (
    <>
      <TopbarBlock searchDisappear={searchDisappear}>
        <div className="left">
          <div onClick={clickHome} className="home btn">
            <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="logo" /> 
          </div>
          <div>
            {searchVisible ? 
              <div className="search-wrap active">
                <input autoFocus onBlur={focusOutSearch} className="search-input" onChange={changeSearchInput} value={searchInput} placeholder="Surn 검색"></input> 
                <div className="search-btn btn active"><BsSearch size="18px" color={theme.palette.gray} /></div> 
              </div>
              :
              <div className="search-wrap">
                <div onClick={clickSearchActive} className="search-btn btn"><BsSearch size="18px" color={theme.palette.gray} /></div>
              </div>
            }
          </div>
        </div>
        <div className="center">
          {getActiveTab(activeTab)}
        </div>
        <div className="right">
          {checkLogin ? 
            <div class="menu-wrap">
              <div onClick={clickMsg} data-tip="채팅" className="message btn">
                <FiMessageSquare color={getRightMenuColor(activeRightMenu).msg} size="20px"></FiMessageSquare>
              </div>
              <div onClick={clickNoti} data-tip="알림" className="notification btn">
                <MdNotificationsNone color={getRightMenuColor(activeRightMenu).noti} size="20px"></MdNotificationsNone>
              </div>
              <div onClick={clickMenu} data-tip="계정" className="menu btn">
                <BiDownArrow color={getRightMenuColor(activeRightMenu).menu} size="20px"></BiDownArrow>
              </div>
            </div>
            :
              null
          }
        </div>
      </TopbarBlock>
      <TopbarDropdown menuNumber={activeRightMenu} />
      <ReactTooltip delayShow={200}/>
    </>
  );
};

export default Topbar;
