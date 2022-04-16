import styled from 'styled-components';

export const Container = styled.div<{ selected: boolean }>`
  margin-bottom: 2px;
  background: ${(props) => (props.selected ? props.theme.buttonColor : 'inherit')};
  //  background-color: ${(props) => props.theme.buttonColor};
  &:hover {
    background-color: ${(props) => props.theme.buttonColor};
  }
  input {
    margin-left: 30px;
  }
  button,
  ul {
    margin-right: 10px;
  }
`;
