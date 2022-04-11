import { atom } from 'recoil';
import { IProject, IboardsOrder } from '../Typings/db';

//프로젝트에 포함되는 보드들,프로젝트가 생성되면 ToDo,Doing,Done 보드들이 기본적으로 주어짐
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

//프로젝트에 포함되는 보드들의 순서
export const boardsOrderState = atom<IboardsOrder>({
  key: 'boardsOrder',
  default: {
    projectId: '',
    order: ['ToDo', 'Doing', 'Done'],
  },
});
