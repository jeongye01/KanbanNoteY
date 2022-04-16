import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { db, editProjectName } from '../../firebase';
import { IProject } from '../../Typings/db';
import { useRecoilValue } from 'recoil';
import { doc, deleteDoc } from 'firebase/firestore';
import EditRemoveBox from '../EditRemoveBox';
import { Container } from './styles';
import { projectsState } from '../../Atoms/project';

interface Props {
  project: IProject;
}

function ProjectItem({ project }: Props) {
  const [display, setDisplay] = useState<boolean>(true);
  const { id: projectId, name: projectName } = project;
  const history = useHistory();
  const { projectId: projectOnUrl } = useParams<{ projectId: string }>();
  const [newProjectName, setNewProjectName] = useState('');

  const projects = useRecoilValue(projectsState);
  const onNewProjectNameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newProjectName.trim()) return;
      try {
        await editProjectName(projectId, newProjectName);
      } catch {
        console.log('fail');
      }
    },
    [newProjectName],
  );
  const onDelete = async () => {
    await deleteDoc(doc(db, 'projects', projectId));

    let deleteIndex: number = 0;
    projects?.forEach((prevProject, i) => {
      if (prevProject.id === projectId) deleteIndex = i;
    });

    if (projectOnUrl === projectId) {
      try {
        history.push(`/project/${projects[deleteIndex + 1].id}`);
      } catch {
        if (projects?.length === 1) history.push('/');
        else history.push(`/project/${projects[deleteIndex - 1].id}`);
      }
    }
  };

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => setNewProjectName(event.currentTarget.value),
    [],
  );
  useEffect(() => {
    if (projectId !== projectOnUrl) return () => setDisplay(false);
  }, []);
  return (
    <>
      {display && (
        <Container selected={projectId === projectOnUrl}>
          <EditRemoveBox
            onEdit={onNewProjectNameSubmit}
            onInputChange={onInputChange}
            inputValue={newProjectName}
            text={projectName}
            onDelete={onDelete}
            link={`/project/${projectId}`}
          />
        </Container>
      )}
    </>
  );
}

export default React.memo(ProjectItem);
