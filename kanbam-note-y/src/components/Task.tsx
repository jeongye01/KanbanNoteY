import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, projectState } from '../Atoms/project';
import { IProject, Itask } from '../Typings/db';
import { userState } from '../Atoms/user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Input from './Input';
import EditRemoveBox from './EditRemoveBox';
const List = styled.li<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightGreen' : 'white')};
  li {
    opacity: 0.5;
  }
  input {
    padding: 2px;
  }
`;

interface Iprops {
  boardKey: string;
  task: Itask;
  idx: number;
}
function Task({ boardKey, task, idx }: Iprops) {
  const [updatedTaskName, setUpdatedTaskName] = useState<string>(task.content);
  const [project, setProject] = useRecoilState(projectState);

  const onTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (updatedTaskName) {
      setProject((prev) => {
        const copyBoard = { ...prev.contents[boardKey] };
        const copyTasks = [...copyBoard.tasks];
        const { id } = copyTasks[idx];
        copyTasks.splice(idx, 0, { id, content: updatedTaskName });
        copyTasks.splice(idx + 1, 1);
        const newProject = {
          ...prev,
          contents: { ...prev.contents, [`${boardKey}`]: { name: copyBoard.name, tasks: copyTasks } },
        };
        updateProject(project.id, newProject);
        return newProject;
      });
    }
  };
  const updateProject = async (id: string, newProject: IProject) => {
    await setDoc(doc(db, 'projects', id), {
      ...newProject,
    });
  };

  const onTaskChanged = (event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedTaskName(event.currentTarget.value);
  };

  const onTaskDelete = async () => {
    setProject((prev) => {
      const copyBoard = { ...prev.contents[boardKey] };
      const copyTasks = [...copyBoard.tasks];

      copyTasks.splice(idx, 1);
      const newProject = {
        ...prev,
        contents: { ...prev.contents, [`${boardKey}`]: { name: copyBoard.name, tasks: copyTasks } },
      };
      updateProject(project.id, newProject);
      return newProject;
    });
  };
  return (
    <Draggable draggableId={`${task.id}`} index={idx}>
      {(provided, snapshot) => (
        <List
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <EditRemoveBox
            onEdit={onTaskSubmit}
            onInputChange={onTaskChanged}
            inputValue={updatedTaskName}
            text={task.content}
            onDelete={onTaskDelete}
          />
        </List>
      )}
    </Draggable>
  );
}

export default React.memo(Task);
