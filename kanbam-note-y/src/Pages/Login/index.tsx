import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Wrapper, Logo, Form, Error, Submit, LinkMessage } from '../SignUp/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userLogin } from '../../firebase';

interface IFormInputs {
  email: string;
  password: string;
  loginResult?: string;
}

function Login() {
  const [fail, setFail] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const { email, password } = data;
    userLogin(email, password).then((result) => {
      setError('loginResult', { message: result });
    });
  };
  const guestLogin = () => {
    if (process.env.REACT_APP_GUEST_EMAIL && process.env.REACT_APP_GUEST_PASSWORD) {
      const result = userLogin(process.env.REACT_APP_GUEST_EMAIL, process.env.REACT_APP_GUEST_PASSWORD);
    }
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
              clearErrors('loginResult');
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
            onClick={() => {
              clearErrors('password');
              clearErrors('loginResult');
            }}
          />
          {errors ? <Error>{errors.loginResult?.message}</Error> : null}
          <Submit type="submit" value="로그인" />

          <LinkMessage>
            계정이 아직 없으신가요? <Link to={'/signup'}>회원가입</Link>
          </LinkMessage>
        </Form>
        <LinkMessage>
          가입없이 <button onClick={guestLogin}>게스트 로그인 &rarr;</button>
        </LinkMessage>
      </Wrapper>
    </Container>
  );
}

export default Login;
