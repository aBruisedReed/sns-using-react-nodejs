import React, { useState, useContext } from 'react';
import styled, { css, keyframes, ThemeContext } from 'styled-components';
import { BsSearch } from 'react-icons/bs';

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
  padding-left: 10px;
  padding-right: 10px;

  & * {
    display: flex;
  }

  .btn {
    cursor: pointer;
  }

  .left, .center, .right {
    height: 100%;
    display: flex;
  }

  // left
  .left {
    justify-content: flex-start;
    align-items: center;
  }
  .left .home {
    margin-right: 10px;
  }
  .left .home img {
    height: 50px;
    width: 50px;
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

  // right
  .right {
    justify-content: flex-end;
  }
`;

function Topbar() {
  // using theme context
  const theme = useContext(ThemeContext);

  // left
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

  return (
    <TopbarBlock searchDisappear={searchDisappear}>
      <div className="left">
        <div className="home btn">
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
      <div className="center"></div>
      <div className="right"></div>
    </TopbarBlock>
  );
};

export default Topbar;
