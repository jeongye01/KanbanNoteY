import React, { useCallback, useEffect, useState } from 'react';
import useUser from '../../utils/useUser';
import Input from '../Input';
import { Container } from './styles';
import { createProject } from '../../firebase';

function AddProjectModal() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const { user } = useUser();
  const onSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!newProjectName.trim() || !user) return;
      setNewProjectName('');
      await createProject(newProjectName, user?.uid + '');
    },
    [newProjectName],
  );
  const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewProjectName(event.currentTarget.value);
  }, []);

  useEffect(() => {
    return () => {
      setNewProjectName('');
    };
  }, []);
  return (
    <>
      <Container>
        <h1>New Project 😀</h1>
        <Input onChange={onChange} onSubmit={onSubmit} value={newProjectName} />
      </Container>
    </>
  );
}

export default AddProjectModal;
