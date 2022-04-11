import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../Atoms/user';
import { nanoid } from 'nanoid';
import { IUser } from '../../Typings/db';
import Input from '../Input';
import { Container } from './styles';
import { updateUser, createProject, createBoardsOrder } from '../../firebase';
function AddProjectModal() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [user, setUser] = useRecoilState<IUser>(userState);

  const onSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!newProjectName.trim()) return;
      const id = nanoid(); //프로젝트 아이디 생성

      setUser((prev) => {
        //유저 update
        const fireProcess = async () => {
          await updateUser(id, user, newProjectName); //firebase user db update
          await createProject(id, newProjectName); //firebase create project
          await createBoardsOrder(id); //firebase create boards order
        };
        fireProcess();
        return { ...prev, projects: [...prev.projects, { name: newProjectName, id }] };
      });
      setNewProjectName('');
    },
    [newProjectName],
  );
  const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewProjectName(event.currentTarget.value);
  }, []);

  return (
    <Container>
      <h1>New Project 😀</h1>
      <Input onChange={onChange} onSubmit={onSubmit} value={newProjectName} />
    </Container>
  );
}

export default AddProjectModal;
