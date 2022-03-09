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

interface Props {
  projectId: string;
  projectName: string;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  input {
    margin-left: 30px;
  }
  button {
    all: unset;
    font-size: 18px;
    cursor: pointer;
    margin-right: 10px;
  }
  ul {
    display: flex;
    align-items: center;
    margin-right: 10px;
    li {
      margin-left: 5px;
    }
  }
`;

function EachProject({ projectId, projectName }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [user, setUser] = useRecoilState<IUser>(userState);
  const onNewProjectNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    setEditMode(false);
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
  return (
    <Container>
      {modalOpen && editMode ? (
        <form onSubmit={onNewProjectNameSubmit}>
          {' '}
          <input
            type="text"
            placeholder={newProjectName || projectName}
            onChange={(event: React.FormEvent<HTMLInputElement>) => setNewProjectName(event.currentTarget.value)}
            required
          />
        </form>
      ) : (
        <NavLink activeClassName="selected" to={`/project/${projectId}`}>
          <span>{projectName}</span>
        </NavLink>
      )}

      {modalOpen ? (
        <ul>
          <li onClick={() => setEditMode(true)}>
            <FontAwesomeIcon icon={faPenSquare} />
          </li>
          <li onClick={onDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </li>

          <li
            onClick={() => {
              setModalOpen(false);
              setEditMode(false);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </li>
        </ul>
      ) : (
        <button onClick={() => setModalOpen(true)}>
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      )}
    </Container>
  );
}

export default EachProject;
