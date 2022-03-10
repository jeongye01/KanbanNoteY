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
import styled from 'styled-components';

const Container = styled.div`
  min-width: 160px;
`;

const Form = styled.form`
  padding: 10px;

  h1 {
    margin-bottom: 15px;
  }
  input {
    color: #322d39;
    outline: none;
    padding: 0.3rem;
    border: 2px solid ${(props) => props.theme.accentColor};

    &:focus {
      border-color: orange;
    }
  }
`;

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
    setNewProject('');
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
    <Container>
      <Form onSubmit={onSubmit}>
        <h1>New Project 😀</h1>
        <input name="board-title" type="text" value={newProject} onChange={onChange} />
      </Form>
    </Container>
  );
}

export default AddProjectModal;
