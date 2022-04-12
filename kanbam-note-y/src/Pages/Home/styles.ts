import styled, { keyframes } from 'styled-components';
export const Bubble = styled.div`
  margin-top: 10px;
  display: block;
  width: 270px;
  min-width: 270px;
  height: 62px;
  border: 0;
  background-color: ${(props) => props.theme.outerbgColor};
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
