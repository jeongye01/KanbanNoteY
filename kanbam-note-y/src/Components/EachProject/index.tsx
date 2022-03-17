import React, { useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { IProject, IUser } from '../../Typings/db';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { useRecoilState } from 'recoil';
import { faEllipsis, faTrashCan, faPenSquare, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { userState } from '../../Atoms/user';
import EditRemoveBox from '../EditRemoveBox';

interface Props {
  projectId: string;
  projectName: string;
}

const Container = styled.div`
  margin-bottom: 2px;
  &:hover {
    background-color: ${(props) => props.theme.buttonColor};
  }
  input {
    margin-left: 30px;
  }
  button,
  ul {
    margin-right: 10px;
  }
`;

function EachProject({ projectId, projectName }: Props) {
  const [newProjectName, setNewProjectName] = useState('');
  const [user, setUser] = useRecoilState<IUser>(userState);
  const onNewProjectNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newProjectName) {
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedProject = { ...data, name: newProjectName };

        await setDoc(doc(db, 'projects', projectId), {
          ...updatedProject,
        });
        setUser((prev) => {
          const newUserProjects = prev?.projects?.map((project) => {
            if (project.id === projectId) {
              return { ...project, name: newProjectName };
            }
            return project;
          });
          const updatedUser = { ...prev, projects: newUserProjects };
          updateUser(updatedUser);
          return updatedUser;
        });
      }
    }
  };
  const onDelete = async () => {
    await deleteDoc(doc(db, 'projects', projectId));
    const projects = user?.projects?.filter((project) => project.id !== projectId);
    setUser((prev) => {
      const updatedUser = { ...prev, projects };
      updateUser(updatedUser);
      return updatedUser;
    });
  };
  const updateUser = async (userInfo: IUser) => {
    await setDoc(doc(db, 'users', user.email), {
      ...userInfo,
    });
  };
  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => setNewProjectName(event.currentTarget.value);
  return (
    <Container>
      <EditRemoveBox
        onEdit={onNewProjectNameSubmit}
        onInputChange={onInputChange}
        inputValue={newProjectName}
        text={projectName}
        onDelete={onDelete}
        link={`/project/${projectId}`}
      />
    </Container>
  );
}

export default EachProject;
