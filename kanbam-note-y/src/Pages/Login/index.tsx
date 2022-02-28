import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Wrapper, Logo, Form } from '../SignUp/styles';

function Login() {
  return (
    <Container>
      <Wrapper>
        <Logo to={'#'}>yanban✅</Logo>
        <Form>
          <h1>로그인</h1>
          <span>이메일</span>
          <input type="email" placeholder="이메일" required />
          <span>비밀번호</span>
          <input type="password" placeholder="비밀번호" required />

          <button>로그인</button>
          <div>
            <Link to={'/signup'}>회원가입</Link>
          </div>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Login;
