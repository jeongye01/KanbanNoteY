import { atom, selector, useRecoilValue } from 'recoil';

export interface Itask {
  id: number;
  content: string;
}
export interface IboardsState {
  [key: string]: Itask[];
}

export const boardsState = atom<IboardsState>({
  key: 'boards',
  default: {
    ToDo: [
      { id: 1, content: 'a' },
      { id: 2, content: 'b' },
    ],

    Doing: [
      { id: 3, content: 'c' },
      { id: 4, content: 'd' },
    ],

    Done: [{ id: 5, content: 'e' }],
  },
});

export const boardsOrderState = atom<string[]>({
  key: 'boardsOrder',
  default: ['ToDo', 'Doing', 'Done'],
});
