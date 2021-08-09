import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

const WrapLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const Loading = () => (
  <WrapLoading>
    <ReactLoading type={'spin'} color={'gray'} height={'15%'} width={'15%'} /> 
  </WrapLoading>
);

