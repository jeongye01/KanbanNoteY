import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';
import { IUser } from '../../Typings/db';
import { useRecoilState } from 'recoil';
import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { userState } from '../../Atoms/user';
import EditRemoveBox from '../EditRemoveBox';
import { Container } from './styles';
interface Props {
  projectId: string;
  projectName: string;
}

function EachProject({ projectId, projectName }: Props) {
  console.log('EachProject');
  const history = useHistory();
  const { projectId: urlProject } = useParams<{ projectId: string }>();
  const [newProjectName, setNewProjectName] = useState('');
  const [user, setUser] = useRecoilState<IUser>(userState);
  const onNewProjectNameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
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
    },
    [newProjectName],
  );
  const onDelete = async () => {
    await deleteDoc(doc(db, 'projects', projectId));
    await deleteDoc(doc(db, 'boardsOrders', projectId));
    const projects = user?.projects?.filter((project) => project.id !== projectId);
    setUser((prev) => {
      const updatedUser = { ...prev, projects };
      updateUser(updatedUser);
      return updatedUser;
    });
    if (urlProject === projectId) history.push('/');
  };
  const updateUser = async (userInfo: IUser) => {
    await setDoc(doc(db, 'users', user.email), {
      ...userInfo,
    });
  };
  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => setNewProjectName(event.currentTarget.value),
    [],
  );
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

export default React.memo(EachProject);
