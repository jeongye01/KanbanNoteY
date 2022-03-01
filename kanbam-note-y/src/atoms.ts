import { atom, selector, useRecoilValue } from 'recoil';

export interface Itask {
  id: number;
  content: string;
}
export interface IboardInfo {
  name: string;
  tasks: Itask[];
}
export interface IboardsState {
  userId: string;
  contents: {
    [key: string]: IboardInfo;
  };
}

export interface IboardsOrderState {
  userId: string;
  order: string[];
}

export const boardsState = atom<IboardsState>({
  key: 'boards',
  default: {
    userId: '',
    contents: {
      ToDo: {
        name: 'ToDo',
        tasks: [],
      },

      Doing: {
        name: 'Doing',
        tasks: [],
      },

      Done: { name: 'Done', tasks: [] },
    },
  },
});

export const boardsOrderState = atom<IboardsOrderState>({
  key: 'boardsOrder',
  default: {
    userId: '',
    order: ['ToDo', 'Doing', 'Done'],
  },
});

export interface Iuser {
  name?: string;
  email: string;
  uid: string;
}
export const userState = atom<Iuser>({
  key: 'user',
  default: {
    uid: '',
    name: '',
    email: '',
  },
});
