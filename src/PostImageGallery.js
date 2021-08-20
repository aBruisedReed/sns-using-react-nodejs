import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { VscChromeClose } from 'react-icons/vsc';

const DarkBackground = styled.div`
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
`;

const PostImageGalleryStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 660px;
  
  .btn {
    position: absolute;
    filter: drop-shadow(2px 3px 2px rgb(0 0 0 / 0.4));
    color: white;
    border-radius: 40px;
  }
  .btn:hover {
    color: lightgray;
  }
  .btn:active {
    color: gray;
  }
  .prev {
    left: 0;
  }
  .next {
    right: 0;
  }
  .close {
    right: 0;
    top: 0;
  }
  .wrap-img {
    width: 500px;
    height: 500px;
  }
  .wrap-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;  
  }
`;

function PostImageGallery({ visible, setVisible, imageUrls }) {
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    console.log(cursor);
  }, [cursor])
  const nextImage = () => {
    if(cursor === imageUrls.length-1) {
      setCursor(0);
    } else {
      setCursor(cursor+1);
    }
  };
  const prevImage = () => {
    if(cursor === 0) {
      setCursor(imageUrls.length-1);
    } else {
      setCursor(cursor-1);
    }
  };
  const gallDom = useRef();
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const closeGallery = () => {
    setVisible(false);
  };
  const handleClickOutside = (e) => {
    if(gallDom.current === null || gallDom.current === undefined) return;
    if(!gallDom.current.contains(e.target)) {
      closeGallery();
    };
  };
  if(!visible) return null;
  return (
    <DarkBackground>
      <PostImageGalleryStyled ref={gallDom}>
        {imageUrls.length !== 1 && (
        <>
        <div className="prev btn" onClick={prevImage}>
          <MdNavigateBefore size="80px" />
        </div>
        <div className="next btn" onClick={nextImage}>
          <MdNavigateNext size="80px" />
        </div>
        </> )
        }
        <div className="close btn" onClick={closeGallery} >
          <VscChromeClose size="40px" />
        </div>
        <div className="wrap-img">
          <img src={imageUrls[cursor]} alt={imageUrls[cursor]} />
        </div>
      </PostImageGalleryStyled>
    </DarkBackground>
  );
}

export default PostImageGallery;
