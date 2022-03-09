import { atom, selector, useRecoilValue } from 'recoil';
import { IUser } from '../Typings/db';

export const userState = atom<IUser>({
  key: 'user',
  default: {
    uid: '',
    name: '',
    email: '',
    projects: [],
  },
});

export const isLoggedIn = atom<boolean>({
  key: 'userLoggedIn',
  default: false,
});
