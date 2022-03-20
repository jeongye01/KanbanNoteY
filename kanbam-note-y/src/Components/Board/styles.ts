import styled from 'styled-components';

export const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 5px;
  overflow: hidden;
  height: max-content;
  div {
    display: flex;
  }
  form {
    margin-right: 15px;
  }
  button {
    opacity: 0.5;
  }
`;

export const TaskList = styled.ul<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  width: 275px;
  min-height: 100px;
  flex-grow: 1;
`;

export const Add = styled.button`
  opacity: 0.7;
`;
export const Header = styled.header`
  width: 100%;
  padding: 0 5px;
  span {
    font-weight: 600;
  }
  button,
  ul {
    color: ${(props) => props.theme.buttonColor};
  }
  margin-bottom: 5px;
`;
