import styled from 'styled-components';
export const Container = styled.div`
  display: flex;
`;

export const AddBoard = styled.form`
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
  color: #a7b4c1;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out, box-shadow 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
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
