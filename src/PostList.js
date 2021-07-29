import React, { useEffect, useState, useContext } from 'react';
import { usePostState, usePostDispatch, getPost } from './PostContext';
import axios from 'axios';
import { BsThreeDots } from 'react-icons/bs';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { ThemeContext } from 'styled-components';
import { BiLike, BiComment } from 'react-icons/bi';
import { VscClose } from 'react-icons/vsc';
import PostWrite from './PostWrite';


// todo: 순서 역순에 무한 스크롤 구현

let updateList = null;

function PostList() {
  const state = usePostState();
  const dispatch = usePostDispatch();
  const { data, loading, error } = state.postList;

  const fetch = () => {
    getPost(dispatch);
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
  const [data, setData] = useState(props.data);
  const [isMine, setIsMine] = useState(true); // props로 확인 
  const { palette } = useContext(ThemeContext);

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
    await axios.put(`http://localhost:3002/api/posts/${data._id}/like`);
    updatePost();
  };

  // delete button
  const handleDel = async () => {
    await axios.delete(`http://localhost:3002/api/posts/${data._id}`);
    updateList();
  };

  // comment
  // todo: del isMyCmt에 따라서 버튼
  const [isMyCmt, setIsMyCmt] = useState(true);
  const [cmtVisible, setCmtVisible] = useState(false);
  const [cmt, setCmt] = useState('');
  const handleCmtChange = (e) => {
    setCmt(e.target.value);
  };
  const cmtSubmit = async (e) => {
    if(e.key !== 'Enter' || e.target.value === '') return;
    // todo: current user 동적으로 
    await axios.post(`http://localhost:3002/api/posts/${data._id}/comments`, { author: '김진혁', comment: cmt });
    setCmt('');
    updatePost();
  };
  const handleDelCmt = (idx) => {
    return async () => {
      await axios.delete(`http://localhost:3002/api/posts/${data._id}/comments/${idx}`);
      updatePost();
    };
  }
  const cmtListJsx = data.comments ? data.comments.map((cmt, idx) => {
    return (
      <div className="wrap-cmt" key={idx}>
        <div className="profile">
          <div className="wrap-img">
            <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
          </div>
        </div>
        <div className="wrap-content">
          <div className="left">
            <div className="name">{cmt.author}<span className="date">&nbsp;2일</span></div>
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
            <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
          </div>
          <div className="wrap-author">
            <div className="author">{data.author}</div>
            <div className="date">4시간</div>
          </div>
          {isMine &&
          <div class="wrap-wrap-icon">
            <div class="wrap-icon btn" onClick={postMenu}>
              <BsThreeDots color={palette.gray} size="20px" />
            </div> 
          </div>
          }
          {menuToggle &&
            <div class="post-menu">
              <div className="modify btn" onClick={handleModify}>
                <div className="wrap-icon"><FiEdit3 /></div>
                <div className="text-icon"><span>수정하기</span></div>
              </div>
              <div className="delete btn" onClick={handleDel}>
                <div className="wrap-icon"><FiTrash2 /></div>
                <div className="text-icon"><span>삭제하기</span></div>
              </div>
            </div>
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
                  <BiLike />
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
          <div class="cmt-section">
            <div className="wrap-input-section">
              <div className="profile">
                <div className="wrap-img">
                  <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
                </div>
              </div>
              <div className="wrap-input">
                <input placeholder="댓글을 게시하려면 Enter 키를 누르세요..." type="text" value={cmt} onChange={handleCmtChange} onKeyPress={cmtSubmit}/>
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
