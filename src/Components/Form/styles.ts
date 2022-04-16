import styled from 'styled-components';
export const SForm = styled.form`
  input {
    //color: 2px solid ${(props) => props.theme.lightBlue};
    outline: none;
    padding: 0.3rem;
    border: 2px solid ${(props) => props.theme.lightBlue};

    &:focus {
      border-color: ${(props) => props.theme.yellow};
    }
  }
`;
