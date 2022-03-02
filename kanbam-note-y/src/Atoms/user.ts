import { atom, selector, useRecoilValue } from 'recoil';
import { IUser } from '../Typings/db';

export const userState = atom<IUser>({
  key: 'user',
  default: {
    uid: '',
    name: '',
    email: '',
    projectIds: [],
  },
});
