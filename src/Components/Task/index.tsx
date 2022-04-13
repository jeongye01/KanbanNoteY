import React, { useCallback, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { projectState } from '../../Atoms/project';
import { IProject, Itask } from '../../Typings/db';
import { useRecoilState } from 'recoil';
import { updateProject } from '../../firebase';
import EditRemoveBox from '../EditRemoveBox';
import { List } from './styles';

interface Iprops {
  boardKey: string;
  task: Itask;
  idx: number;
}
function Task({ boardKey, task, idx }: Iprops) {
  const [updatedTaskName, setUpdatedTaskName] = useState<string>(task.content);
  const [project, setProject] = useRecoilState(projectState);

  const onUpdatedTaskNameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!updatedTaskName.trim()) return;

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
        const fireProcess = async () => updateProject(project.id, newProject);
        fireProcess();
        return newProject;
      });
    },
    [updatedTaskName],
  );

  const onUpdatedTaskNameChanged = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedTaskName(event.currentTarget.value);
  }, []);

  const onTaskDelete = useCallback(async () => {
    setProject((prev) => {
      const copyBoard = { ...prev.contents[boardKey] };
      const copyTasks = [...copyBoard.tasks];

      copyTasks.splice(idx, 1);
      const newProject = {
        ...prev,
        contents: { ...prev.contents, [`${boardKey}`]: { name: copyBoard.name, tasks: copyTasks } },
      };
      const fireProcess = async () => updateProject(project.id, newProject);
      fireProcess();
      return newProject;
    });
  }, []);
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
            onEdit={onUpdatedTaskNameSubmit}
            onInputChange={onUpdatedTaskNameChanged}
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
