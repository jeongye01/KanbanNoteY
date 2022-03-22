import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';
import { IUser, ProjectByNameAndId } from '../../Typings/db';
import { useRecoilState } from 'recoil';
import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { userState } from '../../Atoms/user';
import EditRemoveBox from '../EditRemoveBox';
import { Container } from './styles';
interface Props {
  project: ProjectByNameAndId;
}

function EachProject({ project }: Props) {
  console.log('EachProject');
  const { id: projectId, name: projectName } = project;
  const history = useHistory();
  const { projectId: projectOnUrl } = useParams<{ projectId: string }>();
  const [newProjectName, setNewProjectName] = useState('');
  const [user, setUser] = useRecoilState<IUser>(userState);
  const onNewProjectNameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newProjectName || !newProjectName.trim()) return;

      console.log('trimtraim', newProjectName.trim());
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedProject = { ...data, name: newProjectName };

        await setDoc(doc(db, 'projects', projectId), {
          ...updatedProject,
        });
        setUser((prev) => {
          const newUserProjects = prev?.projects?.map((prevProject) => {
            if (prevProject.id === projectId) {
              return { ...prevProject, name: newProjectName };
            }
            return prevProject;
          });
          const updatedUser = { ...prev, projects: newUserProjects };
          updateUser(updatedUser);
          return updatedUser;
        });
      }
    },
    [newProjectName],
  );
  const onDelete = async () => {
    await deleteDoc(doc(db, 'projects', projectId));
    await deleteDoc(doc(db, 'boardsOrders', projectId));
    const projects = user?.projects?.filter((prevProject) => prevProject.id !== projectId);
    setUser((prev) => {
      const updatedUser = { ...prev, projects };
      updateUser(updatedUser);
      return updatedUser;
    });
    if (projectOnUrl === projectId) history.push('/');
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
