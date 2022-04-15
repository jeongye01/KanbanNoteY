import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Wrapper, Logo, Form, Submit, Error, LinkMessage, Body } from './styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUser } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
interface IFormInputs {
  name: string;
  email: string;
  password: string;
  password_check: string;
  signUpError?: string;
}
function Signup() {
  const history = useHistory();
  const [fail, setFail] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    watch,
    setError,
  } = useForm<IFormInputs>();
  const password = useRef({});
  password.current = watch('password', '');
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const { name, email, password } = data;
    if (name.trim() && email.trim() && password.trim()) {
      createUser(name, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          updateProfile(user, { displayName: name });
          history.push('/login');
        })
        .catch((error) => {
          setError('signUpError', { message: error });
        });
    }
  };
  return (
    <Container>
      <Wrapper>
        <Logo to={'#'}>yanban✅</Logo>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>회원가입</h1>

          {errors.name && <Error>{errors.name.message}</Error>}
          <input
            {...register('name', { required: '이름을 입력해 주세요' })}
            type="name"
            placeholder="이름"
            onClick={() => clearErrors('name')}
          />
          {errors.email && <Error>{errors.email.message}</Error>}
          <input
            {...register('email', { required: '이메일을 입력해 주세요' })}
            type="email"
            placeholder="이메일"
            onClick={() => {
              clearErrors('email');
              setFail(false);
            }}
          />

          {errors?.password && <Error>{errors?.password?.message}</Error>}
          <input
            {...register('password', {
              required: '비밀번호를 입력해 주세요.',
              minLength: { value: 6, message: '비밀번호는 최소 6자 이상입니다' },
            })}
            type="password"
            placeholder="비밀번호"
            onClick={() => clearErrors('password')}
          />

          {errors.password_check && <Error>{errors.password_check.message}</Error>}
          <input
            {...register('password_check', {
              required: '비밀번호를 입력해 주세요.',
              minLength: 6,
              validate: (value) => value === password.current || '비밀번호가 일치 하지 않습니다.',
            })}
            type="password"
            placeholder="비밀번호 확인"
            onClick={() => clearErrors('password_check')}
          />
          {errors?.signUpError ? <Error>{errors?.signUpError?.message}</Error> : null}
          <Submit type="submit" value="가입 하기" />
          <LinkMessage>
            계정이 있으신가요? <Link to={'/login'}>로그인</Link>
          </LinkMessage>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Signup;
