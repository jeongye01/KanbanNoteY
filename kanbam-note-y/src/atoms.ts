import { atom } from "recoil";

interface Itodo {
  id: number;
  content: string;
}
interface IboardsState {
  [key: string]: Itodo[];
}

export const boardsState = atom<IboardsState>({
  key: "boards",
  default: {
    ToDo: [
      { id: Date.now(), content: "a" },
      { id: Date.now(), content: "b" },
    ],
    Doing: [
      { id: Date.now(), content: "c" },
      { id: Date.now(), content: "d" },
    ],
    Done: [{ id: Date.now(), content: "e" }],
  },
});
