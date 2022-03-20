import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 2px;
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
