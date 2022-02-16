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
  [key: string]: IboardInfo;
}

export const boardsState = atom<IboardsState>({
  key: 'boards',
  default: {
    '1': {
      name: 'ToDo',
      tasks: [
        { id: 11, content: 'a' },
        { id: 12, content: 'b' },
      ],
    },

    '2': {
      name: 'Doing',
      tasks: [
        { id: 23, content: 'c' },
        { id: 24, content: 'd' },
      ],
    },

    '3': { name: 'Done', tasks: [] },
  },
});

export const boardsOrderState = atom<string[]>({
  key: 'boardsOrder',
  default: ['1', '2', '3'],
});
