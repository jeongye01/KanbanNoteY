import { atom } from 'recoil';
import { IProject, IboardsOrder } from '../Typings/db';

export const projectState = atom<IProject>({
  key: 'boards',
  default: {
    id: '',
    name: '',
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

export const boardsOrderState = atom<IboardsOrder>({
  key: 'boardsOrder',
  default: {
    projectId: '',
    order: ['ToDo', 'Doing', 'Done'],
  },
});
