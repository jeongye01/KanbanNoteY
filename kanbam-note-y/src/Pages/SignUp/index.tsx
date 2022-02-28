import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Wrapper, Logo, Form, Submit } from './styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { db, createUser, userExist } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
interface IFormInputs {
  name: string;
  email: string;
  password: string;
  password_check: string;
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
  } = useForm<IFormInputs>();
  const password = useRef({});
  password.current = watch('password', '');
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    console.log(data);
    const { name, email, password, password_check } = data;

    const docRef = doc(db, 'users', email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFail(true);
    } else {
      history.push('/');
    }
    createUser(name, email, password);
    /*onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        if (user.email === email) {
          history.push('/');
        } else {
          setFail(true);
        }
      }
    });*/
  };
  return (
    <Container>
      <Wrapper>
        <Logo to={'#'}>yanban✅</Logo>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>회원가입</h1>

          {errors.name && <p>{errors.name.message}</p>}
          <input
            {...register('name', { required: '이름을 입력해 주세요' })}
            type="name"
            placeholder="이름"
            onClick={() => clearErrors('name')}
          />
          {errors.email && <p>{errors.email.message}</p>}
          <input
            {...register('email', { required: '이메일을 입력해 주세요' })}
            type="email"
            placeholder="이메일"
            onClick={() => {
              clearErrors('email');
              setFail(false);
            }}
          />

          {errors.password && <p>{errors.password.message}</p>}
          <input
            {...register('password', {
              required: '비밀번호를 입력해 주세요.',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/i,
                message: '최소 8 자 및 최대 16 자, 영문자 및 숫자 하나 이상',
              },
            })}
            type="password"
            placeholder="비밀번호"
            onClick={() => clearErrors('password')}
          />

          {errors.password_check && <p>{errors.password_check.message}</p>}
          <input
            {...register('password_check', {
              required: '비밀번호를 입력해 주세요.',
              validate: (value) => value === password.current || '비밀번호가 일치 하지 않습니다.',
            })}
            type="password"
            placeholder="비밀번호 확인"
            onClick={() => clearErrors('password_check')}
          />
          {fail ? <p>이미 존재하는 이메일 입니다.</p> : null}
          <Submit type="submit" value="가입 하기" />
          <div>
            <Link to={'/login'}>로그인</Link>
          </div>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Signup;
