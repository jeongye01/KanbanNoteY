import styled, { keyframes } from 'styled-components';
const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`;

export const DotWrapper = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: flex-end;
`;
export const Dot = styled.div<{ delay: string }>`
  background-color: black;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${(props) => props.delay};
`;
export const Container = styled.div`
  display: flex;
`;

export const Bubble = styled.div`
  margin-top: 10px;
  display: block;
  width: 270px;
  min-width: 270px;
  height: 62px;
  border: 0;
  background-color: ${(props) => props.theme.darkBlue};
  border-bottom-left-radius: 41px;
  border-bottom-right-radius: 41px;
  border-top-left-radius: 41px;
  border-top-right-radius: 0;
  box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.07);
  margin-bottom: 22px;
  font-size: 17px;

  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out, box-shadow 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  font-weight: 600;
  color: white;
`;

export const AddBoard = styled(Bubble)`
  color: #a7b4c1;
  input {
    height: 25px;
  }
`;
export const AddBoardInput = styled.input`
  border: 2px solid black;
  padding-left: 10px;
  font-size: 15px;
  border-right: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
export const AddBoardSubmit = styled.input`
  border: 2px solid black;

  background-color: orange;
  font-size: 18px;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;
