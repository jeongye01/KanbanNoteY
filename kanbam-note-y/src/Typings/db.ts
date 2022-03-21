export interface ProjectByNameAndId {
  name: string;
  id: string;
}
export interface IUser {
  uid: string;
  name: string;
  email: string;
  projects: ProjectByNameAndId[];
}

export interface Itask {
  id: number;
  content: string;
}
export interface IboardInfo {
  name: string;
  tasks: Itask[];
}
export interface IProject {
  id: string;
  name: string;
  contents: {
    [key: string]: IboardInfo;
  };
}

export interface IboardsOrder {
  projectId: string;
  order: string[];
}

export const defaultProjectContents = {
  ToDo: {
    name: 'ToDo',
    tasks: [],
  },

  Doing: {
    name: 'Doing',
    tasks: [],
  },

  Done: { name: 'Done', tasks: [] },
};

export const defaultBoardsOrder = ['ToDo', 'Doing', 'Done'];
