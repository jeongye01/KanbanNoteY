import styled from 'styled-components';
import { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Wrapper, Logo, Form, Error, Submit, LinkMessage } from '../SignUp/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userLogin, db, user } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../Atoms/user';
interface IFormInputs {
  email: string;
  password: string;
}

function Login() {
  const history = useHistory();
  const [fail, setFail] = useState(false);
  const setUser = useSetRecoilState(userState);
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const { email, password } = data;
    userLogin(email, password);
  };
  return (
    <Container>
      <Wrapper>
        <Logo to={'#'}>yanban✅</Logo>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>로그인</h1>
          {errors.email && <Error>{errors.email.message}</Error>}
          <span>이메일</span>
          <input
            {...register('email', { required: '이메일을 입력해 주세요' })}
            type="email"
            placeholder="이메일"
            onClick={() => {
              clearErrors('email');
            }}
          />
          <span>비밀번호</span>
          {errors.password && <Error>{errors.password.message}</Error>}
          <input
            {...register('password', {
              required: '비밀번호를 입력해 주세요.',
            })}
            type="password"
            placeholder="비밀번호"
            onClick={() => clearErrors('password')}
          />
          {fail ? <Error>알수 없는 오류가 발생했습니다.</Error> : null}
          <Submit type="submit" value="로그인" />

          <LinkMessage>
            계정이 아직 없으신가요? <Link to={'/signup'}>회원가입</Link>
          </LinkMessage>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Login;
