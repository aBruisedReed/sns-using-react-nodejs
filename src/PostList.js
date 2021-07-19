import React, { useEffect } from 'react';
import { usePostState, usePostDispatch, getPost } from './PostContext';

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

function PostItem({ data }) {
  return (
    <div>
      <img src={data.img} alt="" />
      <div className="upper">
        <div className="author">{data.author}</div>
        <div className="date">{data.date}</div>
        <div className="buttons">
          <button>Modify</button>
          <button>Delete</button>
          <button>Like</button>
        </div>
      </div>
      <div className="middle">
        <div className="content">{data.content}</div>
        <div className="like">LIKE : {data.like}</div>
 PostStateContext     </div>
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

