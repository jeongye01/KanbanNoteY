import { atom } from 'recoil';
import { IUser } from '../Typings/db';

//유저 상태
export const userState = atom<IUser>({
  key: 'user',
  default: {
    uid: '',
    name: '',
    email: '',
    projects: [],
  },
});

//유저가 로그인 되었는가
export const isLoggedIn = atom<boolean>({
  key: 'userLoggedIn',
  default: false,
});
