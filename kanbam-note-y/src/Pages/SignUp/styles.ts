import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Body = styled.body`
  background: white;
  width: 100%;
  height: 100vh;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 80px auto;
  border: 1px solid gray;
`;

export const Wrapper = styled.div`
  background: #fff;

  padding: 3rem 4rem;
  width: 100%;
`;
export const Logo = styled(Link)`
  display: block;

  text-align: center;
  margin-bottom: 30px;
  width: 100%;

  font-family: 'Quicksand', sans-serif;
  color: ${(props) => props.theme.accentColor};
  font-size: 30px;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  h1 {
    text-align: center;
    padding: 10px;
    margin-bottom: 15px;
  }
  input {
    margin: 0.5rem 0 0.8rem 0;
    color: #322d39;
    outline: none;
    padding: 1rem 1rem;
    border: solid 1px #322d39;

    &:focus {
      border-color: ${(props) => props.theme.accentColor};
    }
  }

  a {
    margin: 1rem 0;
    text-decoration: none;
  }
`;
export const Error = styled.p`
  font-size: 12px;
  color: red;
`;
export const Submit = styled.input`
  padding: 1rem;
  color: #fff;
  background: ${(props) => props.theme.accentColor};
  border: none;
  cursor: pointer;
  transition: background 0.7s;
  margin-top: 20px;
  &:hover {
    opacity: 0.8;
  }
`;

export const LinkMessage = styled.div`
  font-size: 12px;
  a {
    color: ${(props) => props.theme.accentColor};
  }
`;
