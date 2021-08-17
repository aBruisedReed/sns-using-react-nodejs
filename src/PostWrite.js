import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { updateList } from './PostList';
import styled, { ThemeContext } from 'styled-components';
import { VscChromeClose } from 'react-icons/vsc';
import { IoMdImages } from 'react-icons/io';
import { FaUserTag, FaHashtag } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import { useAuthState, getName, getUserId, useAuthDispatch, updateUser, getUserImg } from './AuthContext';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const PostWriteBlock = styled.div`
  background: ${props=>props.theme.palette.white};
  width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
  border-radius: 10px;

  & * {
    display: flex;
  }

  // title
  .title {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid ${props=>props.theme.palette.lightGray};
  }
  .title .title-text {
    font-weight: bold;
    font-size: 22px;
    margin-right: 10px;
  }
  .title .close-btn {
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    border-radius: 40px;
  }
  .title .close-btn:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .title .close-btn:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }

  // author
  .author {
    margin: 10px 0;
  }
  .author .wrap-img {
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid ${props=>props.theme.palette.lightGray};
    margin-left: 10px;
  }
  .author img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
  .author .wrap-name {
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .author .name {
    font-weight: bold;
    height: auto;
  }
  // content
  .content {
    height: 200px;
    flex-direction: column;
  }
  .content textarea {
    font-size: 24px;
    height: 100%;
    width: 100%;
    margin: 10px;
  }
  
  // lower
  .lower {
    align-items: center;
    height: 58px;
    margin: 10px;
    margin-top: 15px;
    border: 1px solid ${props=>props.theme.palette.lightDarkDarkGray};
    border-radius: 10px;
  }
  .lower .wrap-text {
    align-items: center;
    width: 100%;
    margin-left: 20px;
  }
  .lower .text {
    height: auto;
    font-weight: 500;
    font-size: 15px;
  }
  .lower .btn {
    border-radius: 5px;
    margin-right: 20px;
    width: 40px;
    height: 40px;

  }
  .lower .btn:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .lower .btn:active {
    background: ${props=>props.theme.palette.lightDarkGray};
  }

  // submit
  .submit {
    width: 100%;
  }
  .submit .btn {
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    margin: 10px;
    border-radius: 10px;
    border: none;
    background: ${props=>props.theme.palette.blue};
    color: white;
  }
  .submit .btn:hover {
    background-color: ${props=>props.theme.palette.darkBlue};
  }
  .submit .btn:active {
    background-color: ${props=>props.theme.palette.darkDarkBlue};
  }
  .submit .empty {
    background: ${props=>props.theme.palette.lightGray};
    color: ${props=>props.theme.palette.gray};
    cursor: not-allowed;
  }
  .submit .empty:hover {
    background: ${props=>props.theme.palette.lightGray};
  }
  .submit .empty:active {
    background: ${props=>props.theme.palette.lightGray};
  }
`;

function PostWrite({ visible, setVisible, isModify, data }) {
  const imageInputDom = useRef();
  const theme = useContext(ThemeContext);
  const [content, setContent] = useState('');
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const author = getName(authState);
  const authorId = getUserId(authState);
  const authorImg = getUserImg(authState);
  const placeholder = `${author}님, 무슨 생각을 하고 계신가요?`;
  const [isEmpty, setIsEmpty] = useState(true);

  const writePost = async () => {
    if(isModify) {
      await axios.put(`http://localhost:3002/api/posts/${data._id}`, { author, content, authorId, authorImg, imgsUrl }, 
        {
          headers: { 'x-access-token': `${authState.token}` }
        });
    } else {
      await axios.post('http://localhost:3002/api/posts', { author, content, authorId, authorImg, imgsUrl },
        {
          headers: { 'x-access-token': `${authState.token}` }
        });
    }
    await updateUser(authState, authDispatch);
    setContent('');
    // setIsEmpty(true);
    closeWrite();
    updateList();
  };

  // todo: 글자 수 일정 수 넘어가면 글자 축소, 다 많아지면 스크롤
  const handleInputChange = (e) => {
    setContent(e.target.value);
    e.target.value.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
  };
  
  const closeWrite = () => {
    setVisible(false);
    setContent('');
    setIsEmpty(true);
    setImg([]);
    setImgsUrl([]);
  };

  // when click outside, close
  const writeDom = useRef();
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleClickOutside = (e) => {
    if(writeDom.current === null || writeDom.current === undefined) return;
    if(!writeDom.current.contains(e.target)) {
      closeWrite();
    };
  };


  // modify 
  useEffect(() => {
    if(isModify) {
      setContent(data.content);
      // todo: imgsurl
      setIsEmpty(false);
    }
  }, []);

  // add props
  const [img, setImg] = useState(null);
  const [imgsUrl, setImgsUrl] = useState([]);
  const [uploading, setUploading] = useState(false);
  const addImage = () => {
    imageInputDom.current.click(); 
  };
  const onImgChange = (e) => {
    console.log('here');
    console.log(Array.isArray(imgsUrl));
    setImg(e.target.files[0]);
    uploadImage();
  };
  const uploadImage = async () => {
    if(img === null) return;
    // todo: loading spin
    console.log(typeof imgsUrl);
    setUploading(true);
    console.log('img', img);
    const formData = new FormData();
    formData.append('file', img);
    const res = await axios.post('http://localhost:3002/api/files/image', formData);
    console.log(res.data.url);
    // setImgsUrl(imgsUrl.concat(`http://localhost:3002/api${res.data.url}`));
    // setImgsUrl([...imgsUrl, `http://localhost:3002/api${res.data.url}`]);
    setImgsUrl(['123']);
    console.log(imgsUrl); // []
    console.log(res);
    setUploading(false);
  };

  const peopleTag = () => {
  };

  const hashTag = () => {
  };
  
  if(!visible) return null;
  return (
    <DarkBackground>
      <PostWriteBlock ref={writeDom}>
        <div className="title">
          <div className="title-text">게시물 작성하기</div>
          <div className="close-btn btn" onClick={closeWrite}><VscChromeClose size="25px" color={theme.palette.gray} /></div>
        </div>
        <div className="author">
          <div className="profile">
            <div className="wrap-img">
              {authorImg ? 
              <img src={authorImg} alt="profile" /> :
              <img src={process.env.PUBLIC_URL + '/person-icon.png'} alt="profile" />
              }
            </div>
            <div className="wrap-name">
              <div className="name">{author}</div>
            </div>
          </div>
        </div>
        <div className="content">
          <textarea value={content} placeholder={placeholder} onChange={handleInputChange}/>
          <input className="hidden" ref={imageInputDom} type="file" accept='image/*' onChange={onImgChange} />
          {/*}         {imgsUrl.length !== 0 &&
          <div className="imgs">
            {imgsUrl.maps(url => ( 
              <div class="wrap-img" key={url}>
                <img src={url} alt={url} />
              </div>
            ))}
            {uploading && 
              <div class="wrap-img">Loading</div>
            }
          </div>
          }*/}
        </div>
        <div className="lower">
          <div className="wrap-text">
            <div className="text">게시물에 추가</div>
          </div>
          <div className="wrap-icon btn" data-tip="사진" onClick={addImage}><IoMdImages size="40px" color={theme.palette.green}/></div>
          <div className="wrap-icon btn" data-tip="인물 태그" onClick={peopleTag}><FaUserTag size="40px" color={theme.palette.blue}/></div>
          <div className="wrap-icon btn" data-tip="해쉬 태그" onClick={hashTag}><FaHashtag size="40px" color={theme.palette.red}/></div>
        </div>
        <div className="submit">
          {
            isEmpty ? 
              (<div className="submit-btn btn empty">게시</div>) :
              (<div className="submit-btn btn" onClick={writePost}>게시</div>)
          }
        </div>
      </PostWriteBlock>
      <ReactTooltip delayShow={100} />
    </DarkBackground>
  );
}

export default PostWrite;
