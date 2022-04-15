import React, { useCallback, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { projectState } from '../../Atoms/project';
import { IboardInfo, IProject, Itask } from '../../Typings/db';
import { useRecoilState } from 'recoil';
import { updateProject } from '../../firebase';
import EditRemoveBox from '../EditRemoveBox';
import { List } from './styles';

interface Iprops {
  boardId: string;
  task: Itask;
  idx: number;
}
function Task({ boardId, task, idx }: Iprops) {
  const [updatedTaskName, setUpdatedTaskName] = useState<string>(task.content);
  const [project, setProject] = useRecoilState(projectState);

  const onUpdatedTaskNameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!updatedTaskName.trim()) return;

      const copyBoard: IboardInfo = { ...project.boards[boardId] };
      const copyTasks: Itask[] = [...copyBoard.tasks];
      const { id } = copyTasks[idx];
      copyTasks.splice(idx, 0, { id, content: updatedTaskName });
      copyTasks.splice(idx + 1, 1);
      const newProject: IProject = {
        ...project,
        boards: { ...project.boards, [boardId]: { name: copyBoard.name, tasks: copyTasks } },
      };
      const editTaskName = async () => updateProject(project.id, newProject);
      editTaskName();
    },
    [updatedTaskName],
  );

  const onUpdatedTaskNameChanged = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedTaskName(event.currentTarget.value);
  }, []);

  const onTaskDelete = useCallback(async () => {
    const copyBoard: IboardInfo = { ...project.boards[boardId] };
    const copyTasks: Itask[] = [...copyBoard.tasks];

    copyTasks.splice(idx, 1);
    const newProject: IProject = {
      ...project,
      boards: { ...project.boards, [boardId]: { name: copyBoard.name, tasks: copyTasks } },
    };
    const deleteTask = async () => updateProject(project.id, newProject);
    deleteTask();
  }, []);
  return (
    <>
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
    </>
  );
}

export default React.memo(Task);
