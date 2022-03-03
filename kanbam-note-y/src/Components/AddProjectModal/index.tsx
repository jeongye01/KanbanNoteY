import Modal from '../Modal';
//import { Button, Input, Label } from '../../Pages/SignUp/styles';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { db } from '../../firebase';
import { userState } from '../../Atoms/user';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { defaultProjectContents, defaultBoardsOrder, IUser } from '../../Typings/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
function AddProjectModal() {
  const params = useParams<{ workspace?: string }>();
  const [newProject, setNewProject] = useState<string>('');
  const [user, setUser] = useRecoilState<IUser>(userState);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const id = nanoid();
    setUser((prev) => {
      updateUser(id);
      createProject(id);
      createBoardsOrder(id);
      return { ...prev, projects: [...prev.projects, { name: newProject, id }] };
    });
    console.log('add project', user);
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewProject(event.currentTarget.value);
  };
  const updateUser = async (id: string) => {
    await setDoc(doc(db, 'users', user.email), {
      ...user,
      projects: [...user.projects, { name: newProject, id }],
    });
    console.log('add project', user);
  };
  const createProject = async (id: string) => {
    await setDoc(doc(db, 'projects', id), {
      id,
      name: newProject,
      contents: defaultProjectContents,
    });

    console.log('add project', user);
  };
  const createBoardsOrder = async (id: string) => {
    await setDoc(doc(db, 'boardsOrders', id), {
      projectId: id,
      order: defaultBoardsOrder,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>프로젝트 이름</span>
        <input name="board-title" type="text" onChange={onChange} />
      </label>
    </form>
  );
}

export default AddProjectModal;
