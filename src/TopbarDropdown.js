import React, { useState, useContext } from 'react';
import { BsPencilSquare, BsDot } from 'react-icons/bs';
import styled, { ThemeContext }  from 'styled-components';
import ReactTooltip from 'react-tooltip';

const TopbarDropdownBlock = styled.div`
  position: fixed;
  top: 56px;
  right: 0px;
  display: flex;
  flex-direction: column;
  width: 320px;
  background: ${props => props.theme.palette.white};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;

  .btn:hover {
    background-color: ${props=>props.theme.palette.lightGray};
  }
  .btn:active {
    background-color: ${props=>props.theme.palette.lightDarkGray};
  }

  // messenger
  .header {
    height: 50px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .header h1 {
    color: ${props=>props.theme.palette.black};
    font-size: 24px;
  }
  .header .btn {
    align-items: center;
    justify-content: center;
    color: ${props=>props.theme.palette.gray};
    height: 30px;
    width: 30px;
    border-radius: 20px;
  }
  .chats, .notis {
    flex-direction: column;
  }
  .chats .chat, .noti {
    padding: 5px 0 5px 0;
    border-top: 1px solid ${props=>props.theme.palette.lightGray};
  }

  .profile {
    justify-content: center;
    align-items: center;
    border: 1px solid ${props=>props.theme.palette.lightGray};
    border-radius: 30px;
    height: 56px;
    width: 56px;
    overflow: hidden;
    margin-right: 10px;
    margin-left: 10px;
  }

  .profile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info {
    flex-direction: column;
    justify-content: center;
    width: 200px;
  }

  .info .who {
    font-size: 15px;
    color: ${props=>props.theme.palette.black}
  }

  .info .info-lower {
    font-size: 13px;
    color: ${props=>props.theme.palette.gray};
  }

  .noti-detail {
    display: inline;
    font-size: 14px;
  }
  .noti-detail span {
    display: inline;
    font-weight: bold;
    color: ${props=>props.theme.palette.blue};
  }

  .unread-dot {
    align-items: center;
    width: 30px;
  }

  & * {
    display: flex;
  }

  .empty-page {
    font-size: 20px;
    color: ${props=>props.theme.palette.gray};
  }
`;
const testChats = [
  {
    img: 'asdf', 
    who: '홍길동',
    recent: '어디야?',
    date: '2021-07-23 19:35', // todo: 현재시 기준 10분 전 같은 함수 제작
    unread: true
  },
  {
    img: 'asdf', // == id로 이미지
    who: '홍길동',
    recent: '어디야?',
    date: '2021-07-23 19:35', // todo: 현재시 기준 10분 전 같은 함수 제작
    unread: false
  }
];
const testNotis = [
  {
    img: 'asdf',
    who: '김용균',
    what: 'cmt', // cmt or like
    which: 'post id',
    date: '2021-07-23 19:35', // todo: 현재시 기준 10분 전 같은 함수 제작
    unread: true
  },
  {
    img: 'asdf',
    who: '김용균',
    what: 'cmt', // cmt or like
    which: 'post id',
    date: '2021-07-23 19:35', // todo: 현재시 기준 10분 전 같은 함수 제작
    unread: true
  },
  {
    img: 'asdf',
    who: '김용균',
    what: 'like', // cmt or like
    which: 'post id',
    date: '2021-07-23 19:35', // todo: 현재시 기준 10분 전 같은 함수 제작
    unread: false
  }
];
function TopbarDropdown({ menuNumber }) {
  const theme = useContext(ThemeContext);
  const chatsData = testChats; //test
  const notisData = testNotis;
  switch(menuNumber) {
    case 0:
      return (
        <>
          <TopbarDropdownBlock>
            <div className="header"> 
              <h1>채팅</h1>
              <div data-tip="새 메세지" className="new-msg btn">
                <BsPencilSquare size="16px" />
              </div>
            </div>
            <div className="chats">
              {chatsData !== null ?
                chatsData.map(data => (
                  <div className="chat btn">
                    <div className="profile" >
                      <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
                    </div>
                    <div className="info">
                      <div className="who">{data.who}</div>
                      <div className="info-lower">
                        <div className="recent">{data.recent}</div>
                        &nbsp;·&nbsp;
                        <div className="date">30분 전</div>
                      </div>
                    </div>
                    <div className="unread-dot">
                      {data.unread && 
                      <BsDot size="30px" color={theme.palette.red}/>
                      }
                    </div>
                  </div>
                )) :
                <div class="empty-page">채팅이 없습니다.</div>
              }
            </div>
          </TopbarDropdownBlock>
          <ReactTooltip delayShow={200}/>
        </>
      );
    case 1: 
      return (
        <>
          <TopbarDropdownBlock>
            <div className="header">
              <h1>알림</h1>
            </div>
            <div className="notis">
              {notisData !== null ?
                  notisData.map(data => (
                    <div class="noti btn">
                      <div className="profile">
                        <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
                      </div>
                      <div className="info">
                        <div className="noti-detail">
                          <span>{data.who}</span>님이 {
                            data.what === 'cmt' ?
                              '게시물에 댓글을 달았습니다.' :
                              '게시물에 좋아요를 눌렀습니다.'
                          }
                        </div>
                        <div className="info-lower">
                          <div className="date">30분 전</div>
                        </div>
                      </div>
                      <div className="unread-dot">
                        {data.unread && 
                        <BsDot size="30px" color={theme.palette.red}/>
                        }
                      </div>
                    </div>
                  )) :
                  <div class="empty-page">알림이 없습니다.</div>
              }
            </div>
          </TopbarDropdownBlock>
          <ReactTooltip delayShow={200}/>
        </>
      );
    case 88: 
      return (
        <>
          <TopbarDropdownBlock>

          </TopbarDropdownBlock>
          <ReactTooltip delayShow={200}/>
        </>
      );
    case 99: default: return null;
  }

}

export default TopbarDropdown;
