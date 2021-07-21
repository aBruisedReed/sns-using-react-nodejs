import React, { useEffect, useState } from 'react';
import { usePostState, usePostDispatch, getPost } from './PostContext';
import axios from 'axios';

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
    <div>
      {data.map((item, idx) => {
        return (<PostItem key={item._id} data={item}></PostItem>);
      })}
    </div>
  );
}

export { updateList };

function PostItem(props) {
  // init using data from props
  const [data, setData] = useState(props.data);

  // update post(when comment state changed)
  const updatePost = async () => {
    const res = await axios.get(`http://localhost:3002/api/posts/${data._id}`);
    setData(res.data[0]);
  };

  // modify button
  const [modifyToggle, setModifyToggle] = useState(false);

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
  const [cmt, setCmt] = useState('');
  const handleCmtChange = (e) => {
    setCmt(e.target.value);
  };
  const cmtSubmit = async () => {
    // todo: current user 동적으로 
    await axios.post(`http://localhost:3002/api/posts/${data._id}/comments`, { author: 'current user', comment: cmt });
    setCmt('');
    updatePost();
  };
  const handleDelCmt = (idx) => {
    return async () => {
      await axios.delete(`http://localhost:3002/api/posts/${data._id}/comments/${idx}`);
      updatePost();
    };
  }

  return (
    <div>
      <img src={data.img} alt="" />
      <div className="upper">
        <div className="author">{data.author}</div>
        <div className="date">{data.date}</div>
        <div className="buttons">
          <button>Modify</button>
          <button onClick={handleDel}>Delete</button>
          <button onClick={handleLike}>Like</button>
        </div>
      </div>
      <div className="middle">
        <div className="content">{data.content}</div>
        <div className="like">LIKE : {data.like}</div>
     </div>
      <div className="lower">
        {data.comments ? data.comments.map((cmt, idx) => {
          return (
            <div key={idx}>{cmt.author}: {cmt.comment}<button onClick={handleDelCmt(idx)}>X</button></div>
          );
        }) : null }
        <input type="text" value={cmt} onChange={handleCmtChange} />
        <button onClick={cmtSubmit}>COMMENT</button>
      </div>
    </div>
  );
}

export default PostList;

