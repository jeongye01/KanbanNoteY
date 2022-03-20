import styled from 'styled-components';
export const List = styled.li<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightGreen' : 'white')};
  li {
    opacity: 0.5;
  }
  input {
    padding: 2px;
  }
`;
