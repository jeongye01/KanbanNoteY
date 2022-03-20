import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { db } from '../../firebase';
import { userState } from '../../Atoms/user';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { defaultProjectContents, defaultBoardsOrder, IUser } from '../../Typings/db';
import Input from '../Input';
import { Container } from './styles';

function AddProjectModal() {
  console.log('AddProjectModal');
  const [newProject, setNewProject] = useState<string>('');
  const [user, setUser] = useRecoilState<IUser>(userState);

  const onSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      if (newProject) {
        event.preventDefault();
        const id = nanoid();
        setUser((prev) => {
          updateUser(id);
          createProject(id);
          createBoardsOrder(id);
          return { ...prev, projects: [...prev.projects, { name: newProject, id }] };
        });
        setNewProject('');
      }
    },
    [newProject],
  );
  const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewProject(event.currentTarget.value);
  }, []);
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
    <Container>
      <h1>New Project 😀</h1>
      <Input onChange={onChange} onSubmit={onSubmit} value={newProject} />
    </Container>
  );
}

export default AddProjectModal;
