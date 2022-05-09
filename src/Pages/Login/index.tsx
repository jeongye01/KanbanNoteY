import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Wrapper, Logo, Form, Error, Submit, LinkMessage } from '../SignUp/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { login } from '../../firebase';

interface IFormInputs {
  email: string;
  password: string;
  loginResult?: string;
}

function Login() {
  const history = useHistory();
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const { email, password } = data;
    login(email, password)
      .then((user) => {
        history.push('/');
      })
      .catch((error) => {
        setError('loginResult', { message: error.code });
      });
  };
  const guestLogin = () => {
    if (process.env.REACT_APP_GUEST_EMAIL && process.env.REACT_APP_GUEST_PASSWORD) {
      login(process.env.REACT_APP_GUEST_EMAIL, process.env.REACT_APP_GUEST_PASSWORD)
        .then((user) => {
          history.push('/');
        })
        .catch((error) => {
          setError('loginResult', { message: error.code });
        });
    }
  };
  return (
    <Container>
      <Wrapper>
        <Logo to={'#'}>yanban✅</Logo>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>로그인</h1>

          <span>이메일</span>

          <input
            {...register('email', { required: '이메일을 입력해 주세요' })}
            type="email"
            placeholder="이메일"
            onClick={() => {
              clearErrors('email');
              clearErrors('loginResult');
            }}
          />

          <span>비밀번호</span>

          <input
            {...register('password', {
              required: '비밀번호를 입력해 주세요.',
            })}
            type="password"
            placeholder="비밀번호"
            onClick={() => {
              clearErrors('password');
              clearErrors('loginResult');
            }}
          />
          {errors.email && <Error>{errors.email.message}</Error>}
          {errors.password && <Error>{errors.password.message}</Error>}
          {errors.loginResult && <Error>{errors.loginResult?.message}</Error>}
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

/*
 {
       <LinkMessage>
          가입없이 <button onClick={guestLogin}>게스트 로그인 &rarr;</button>
        </LinkMessage>
      }


*/
