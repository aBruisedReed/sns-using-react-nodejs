import React, { useEffect, useState } from 'react';
import { usePostState, usePostDispatch, getPost } from './PostContext';
import axios from 'axios';

let refresh = null;

function PostList() {
  const [number, setNumber] = useState(0); // re-rendering 을 위한 dummy state
  const state = usePostState();
  const dispatch = usePostDispatch();
  const { data, loading, error } = state.postList;

  const fetch = () => {
    console.log('fetch');
    getPost(dispatch);
  };

  refresh = () => {
    setNumber(number+1);
  };
  
  useEffect(() => {
    fetch();
  }, [number]);

  if(loading || !data) { return <div>Loading...</div> };
  if(error) { return <div>Error occur</div> };
  return (
    <div>
      {data.map(item => {
        return (<PostItem key={item._id} data={item}></PostItem>);
      })}
    </div>
  );
}

export { refresh };

function PostItem({ data }) {
  const [modifyToggle, setModifyToggle] = useState(false);

  // handling like button
  const [like, setLike] = useState(data.like);
  const handleLike = () => {
    axios.put(`http://localhost:3002/api/posts/${data._id}/like`);
    setLike(like+1);
  };

  // handling delete button
  const handleDelete = () => {
    axios.delete(`http://localhost:3002/api/posts/${data._id}`);
    refresh();
  };

  return (
    <div>
      <img src={data.img} alt="" />
      <div className="upper">
        <div className="author">{data.author}</div>
        <div className="date">{data.date}</div>
        <div className="buttons">
          <button>Modify</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleLike}>Like</button>
        </div>
      </div>
      <div className="middle">
        <div className="content">{data.content}</div>
        <div className="like">LIKE : {like}</div>
     </div>
      <div className="lower">
        {data.comments ? data.comments.map(cmt => {
          return (
            <div>{cmt.author}: {cmt.content}</div>
          );
        }) : null }
        <input type="text" />
        <button>COMMENT</button>
      </div>
    </div>
  );
}

export default PostList;

