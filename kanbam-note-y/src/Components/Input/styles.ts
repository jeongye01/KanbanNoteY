import styled from 'styled-components';
export const Form = styled.form`
  input {
    color: #322d39;
    outline: none;
    padding: 0.3rem;
    border: 2px solid ${(props) => props.theme.accentColor};

    &:focus {
      border-color: orange;
    }
  }
`;
