import React, { useEffect, useState, useContext } from 'react';
import { usePostState, usePostDispatch, getPost, getPostUser } from './PostContext';
import axios from 'axios';
import { BsThreeDots } from 'react-icons/bs';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { ThemeContext } from 'styled-components';
import { BiComment } from 'react-icons/bi';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { VscClose } from 'react-icons/vsc';
import PostWrite from './PostWrite';
import moment from 'moment';
import { useAuthState, checkLogin, useAuthDispatch, updateUser, getUserImg } from './AuthContext';


// todo: 순서 역순에 무한 스크롤 구현

let updateList = null;

function PostList({ type, match }) {
  const state = usePostState();
  const dispatch = usePostDispatch();
  const id = match && match.params.id;
  const { data, loading, error } = state.postList;

  const fetch = () => {
    switch(type) {
      case 'all': 
        getPost(dispatch); return;
      case 'user':
        getPostUser(dispatch, id); return;
      default: return;
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // 외부에서 fetch 호출을 위한 함수
  updateList = () => {
    fetch();
  };

  if(loading || !data) { return <div>Loading...</div> };
  if(error) { return <div>Error occur</div> };
  return (
    <div className="post-list">
      {data.slice(0).reverse().map((item, idx) => {
        return (<PostItem key={item._id} data={item}></PostItem>);
      })}
    </div>
  );
}

export { updateList };

function PostItem(props) {
  // init using data from props
  const { palette } = useContext(ThemeContext);
  const [data, setData] = useState(props.data);
  const [isMine, setIsMine] = useState(false); // 내가 글쓴이인지
  const [isLike, setIsLike] = useState(false); // 현재 게시물에 대한 좋아요 여부
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const authHeader = { headers: { 'x-access-token': `${authState.token}` } };
  const userImg = getUserImg(authState);

  useEffect(() => {
    if(authState.userInfo !== null) {
      if(authState.userInfo.posts.includes(data._id)) {
        setIsMine(true);
      }
      if(authState.userInfo.likes.includes(data._id)) {
        setIsLike(true);
      }
    }
  }, []);

  // update post(when comment state changed)
  const updatePost = async () => {
    const res = await axios.get(`http://localhost:3002/api/posts/${data._id}`);
    setData(res.data[0]);
  };

  // three dot menu
  const [menuToggle, setMenuToggle] = useState(false);
  const postMenu = () => {
    setMenuToggle(!menuToggle);
  };
  // modify button
  const [modifyToggle, setModifyToggle] = useState(false);
  const handleModify = () => {
    setModifyToggle(true);
  };

  // like button
  const handleLike = async () => {
    if(checkLogin(authState)) {
      setIsLike(!isLike);
      await axios.put(`http://localhost:3002/api/posts/${data._id}/like`, { isLike }, authHeader);
      await updateUser(authState, authDispatch);
      updatePost();
    } else {
      alert('먼저 로그인해야 합니다.');
      return;
    }
  };

  // delete button
  const handleDel = async () => {
    await axios.delete(`http://localhost:3002/api/posts/${data._id}`);
    updateList();
  };

  // comment
  // todo: del isMyCmt에 따라서 버튼
  const [cmtVisible, setCmtVisible] = useState(false);
  const [cmt, setCmt] = useState('');
  const handleCmtChange = (e) => {
    setCmt(e.target.value);
  };
  const cmtSubmit = async (e) => {
    if(e.key !== 'Enter' || e.target.value === '') return;
    // todo: current user 동적으로 
    await axios.post(`http://localhost:3002/api/posts/${data._id}/comments`, { author: authState.userInfo.name, comment: cmt, authorId: authState.userInfo.id, authorImg: authState.userInfo.image });
    setCmt('');
    updatePost();
  };
  const handleDelCmt = (idx) => {
    return async () => {
      await axios.delete(`http://localhost:3002/api/posts/${data._id}/comments/${idx}`);
      updatePost();
    };
  }
  const handleMsg = () => {
  }
  const cmtListJsx = data.comments ? data.comments.map((cmt, idx) => {
    let isMyCmt = false;
    // console.log('ai', data.authorId);
    // console.log('ui', authState.userInfo.id);
    if(authState.userInfo !== null && cmt.authorId === authState.userInfo.id) {
      isMyCmt = true;
    }
    return (
      <div className="wrap-cmt" key={idx}>
        <div className="profile">
          <div className="wrap-img">
            {cmt.authorImg ? 
            <img src={cmt.authorImg} alt="profile" /> :
            <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
            }
          </div>
        </div>
        <div className="wrap-content">
          <div className="left">
            <div className="name">{cmt.author}<span className="date">&nbsp;{moment(cmt.date).fromNow()}</span></div>
            <div className="content">{cmt.comment}</div>
          </div>
          {isMyCmt &&
          <div className="del-btn btn" onClick={handleDelCmt(idx)}>
            <VscClose />
          </div>
          }
        </div>
      </div>
    );
  }) : null; 
  // todo: 개행 처리, 아래 참고
  // {this.props.data.content.split("\n").map((line) => { //this.props.data.content: 내용
  //             return (
  //               <span>
  //                 {line}
  //                 <br />
  //               </span>
  //             );
  //           })}
  const showCmt = () => {
    setCmtVisible(true);
  };

  // todo: 현재 사용자와 포스트 글쓴이가 같다면 ... 눌러서 수정, 삭제
  return (
    <>
      <div className="post-item post">
        <div className="upper">
          <div className="wrap-img">
            {data.authorImg ? 
            <img src={data.authorImg} alt="profile" /> :
            <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
            }
          </div>
          <div className="wrap-author">
            <div className="author">{data.author}</div>
            <div className="date">{moment(data.date).fromNow()}</div>
          </div>
          <div className="wrap-wrap-icon">
            <div className="wrap-icon btn" onClick={postMenu}>
              <BsThreeDots color={palette.gray} size="20px" />
            </div> 
          </div>
          {menuToggle && (
            isMine ? 
            <div className="post-menu">
              <div className="modify btn" onClick={handleModify}>
                <div className="wrap-icon"><FiEdit3 /></div>
                <div className="text-icon"><span>수정하기</span></div>
              </div>
              <div className="delete btn" onClick={handleDel}>
                <div className="wrap-icon"><FiTrash2 /></div>
                <div className="text-icon"><span>삭제하기</span></div>
              </div>
            </div>
            :
            <div className="post-menu">
              <div className="chat btn" onClick={handleMsg}>
                <div className="wrap-icon"><HiOutlineChatAlt2 /></div>
                <div className="text-icon"><span>메세지 보내기</span></div>
              </div>
            </div>)
          }
        </div>
        <div className="middle">
          <div className="content">{data.content}</div>
          <div className="people-tags"></div>
          <div className="hash-tags"></div>
          <div className="imgs"></div>
        </div>
        <div className="lower">
          <div className="info">
            <div className="like">좋아요 {data.like}개</div>
            <div className="comment" onClick={showCmt}>댓글 {data.comments ? data.comments.length : 0}개</div>
          </div>
          <div className="btns">
            <div className="wrap-btn">
              <div className="btn-like btn" onClick={handleLike}>
                <div className="wrap-icon">
                  {isLike ? 
                    <AiFillLike /> :
                    <AiOutlineLike />
                  }
                </div>
                <div className="text">좋아요</div>
              </div>
            </div>
            <div className="wrap-btn">
              <div className="btn-like btn" onClick={showCmt}>
                <div className="wrap-icon">
                  <BiComment />
                </div>
                <div className="text">댓글 달기</div>
              </div>
            </div>
          </div>
          {cmtVisible && 
          <div className="cmt-section">
            <div className="wrap-input-section">
              <div className="profile">
                <div className="wrap-img">
                  {userImg ? 
                  <img src={userImg} alt="profile" /> :
                  <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
                  }
                </div>
              </div>
              <div className="wrap-input">
                {
                  checkLogin(authState) ?
                    <input placeholder="댓글을 게시하려면 Enter 키를 누르세요..." type="text" value={cmt} onChange={handleCmtChange} onKeyPress={cmtSubmit}/>
                    :
                    <input placeholder="댓글을 게시하려면 로그인 하세요..." type="text" style={{ cursor: "not-allowed" }} readOnly />
                }
              </div>
            </div>
            {cmtListJsx}
          </div>
          }
        </div>
      </div>
      <PostWrite data={data} visible={modifyToggle} setVisible={setModifyToggle} isModify={true}></PostWrite>
    </>
  );
}
// todo: hashtag, 검색까지

export default PostList;
