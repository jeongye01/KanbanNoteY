import styled, { keyframes } from 'styled-components';
export const HomeContainer = styled.div`
  position: absolute;
  left: 260px;
  right: 0px;
  //width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  img {
    z-index: -10;
    margin-top: 12vh;
    height: 70vh;
  }
  div {
    position: absolute;
    left: 10px;
    top: 9vh;
  }
`;
