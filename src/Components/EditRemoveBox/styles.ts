import styled from 'styled-components';
export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    cursor: pointer;
    &:hover {
      font-size: 30px;
    }
  }
  ul {
    display: flex;
    align-items: center;

    li {
      margin-left: 5px;
    }
  }
`;
