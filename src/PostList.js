import React from 'react';
import { useAsync } from 'react-async';
import axios from 'axios';

const defaultData = {
  src: 'aaa',
  author: 'Kim',
  date: '2020-07-14 02:11:11',
  content: 'This is contents..',
  like: 5,
  comments: [
    {
      author: 'Lee',
      content: 'this is cmt content',
    }
  ],
}

function PostList() {
  return (
    <div>
      <PostItem data={defaultData}></PostItem>
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
      </div>
      <div className="lower">
        {data.comments.map(cmt => {
          return (
            <div>{cmt.author}: {cmt.content}</div>
          );
        })}
        <input type="text" />
        <button>COMMENT</button>
      </div>
    </div>
  );
}

// function PostItem({ data }) {
//   return (
//     <div>
//       <img src="" alt="" />
//       <div className="upper">
//         <div className="author">author-name</div>
//         <div className="date">2020-07-14 02:01:34</div>
//         <div className="buttons">
//           <button>Modify</button>
//           <button>Delete</button>
//           <button>Like</button>
//         </div>
//       </div>
//       <div className="middle">
//         <div className="content">This is content.</div>
//         <div className="like">LIKE : 2</div>
//       </div>
//       <div className="lower">
//         <div>KIM: Hi Hello Bon jour.</div>
//         <input type="text" />
//         <button>COMMENT</button>
//       </div>
//     </div>
//   );
// }

export default PostList;

