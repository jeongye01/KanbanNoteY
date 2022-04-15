import { atom } from 'recoil';
import { IProject, IboardsOrder, IboardInfo } from '../Typings/db';

//프로젝트에 포함되는 보드들,프로젝트가 생성되면 ToDo,Doing,Done 보드들이 기본적으로 주어짐
export const projectsState = atom<IProject[]>({
  key: 'projects-state',
  default: [] as IProject[],
});
interface TempIProject {
  id: string;
  name: string;
  contents: {
    [key: string]: IboardInfo;
  };
}
export const projectState = atom<IProject>({
  key: 'boards',
  default: {
    id: '',
    userId: '',
    name: '',
    createdAt: 0,
    boards: {},
    boardsOrder: [],
  },
});

/*
export const projectState = atom<TempIProject>({
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
*/
