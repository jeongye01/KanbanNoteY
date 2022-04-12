import React, { useCallback, useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { IboardInfo } from '../../Typings/db';
import Task from '../Task';
import { useSetRecoilState, useRecoilState } from 'recoil';
import EditRemoveBox from '../EditRemoveBox';
import Input from '../Input';
import { Container, TaskList, Add, Header } from './styles';
import { updateProject, updateBoardsOrder } from '../../firebase';
interface Iprops {
  boardKey: string;
  board: IboardInfo;
  index: number;
}
function Board({ board, boardKey, index }: Iprops) {
  const [project, setProject] = useRecoilState(projectState);
  const setBoardsOrder = useSetRecoilState(boardsOrderState);
  const [updatedBoardName, setUpdatedBoardName] = useState<string>(board?.name);
  const [newTask, setNewTask] = useState<string>('');
  const [addNewTaskMode, setAddNewTaskMode] = useState<boolean>(false);

  const onTaskSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newTask || !newTask.trim()) return;

      setProject((prev) => {
        const newTaskObj = { id: Date.now(), content: newTask };
        const newTasks = [...prev.contents[`${boardKey}`].tasks, newTaskObj];
        const newProject = {
          ...prev,
          contents: { ...prev.contents, [`${boardKey}`]: { name: board.name, tasks: newTasks } },
        };
        const fireProcess = async () => {
          await updateProject(project.id, newProject);
        };
        fireProcess();
        return newProject;
      });

      setNewTask('');
    },
    [newTask],
  );

  const onTaskChanged = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  }, []);
  const onBoardDelete = () => {
    if (!project) return;
    setProject((prev) => {
      const newBoards = { ...prev.contents };
      delete newBoards[`${boardKey}`];
      const newProject = { ...prev, contents: newBoards };
      const fireProcess = async () => {
        await updateProject(project.id, newProject);
      };
      fireProcess();
      return newProject;
    });
    setBoardsOrder((prev) => {
      const newOrder = [...prev.order];
      newOrder.splice(index, 1);
      const newBoardsOrder = { ...prev, order: newOrder };
      const fireProcess = async () => {
        await updateBoardsOrder(project.id, newBoardsOrder, project);
      };
      fireProcess();
      return newBoardsOrder;
    });
  };
  const onBoardNameEditVarChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedBoardName(event.currentTarget.value);
  }, []);
  const onBoardNameEditVarSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!updatedBoardName || !updatedBoardName.trim()) return;
      setProject((prev) => {
        let copyBoard = { ...prev.contents[`${boardKey}`] };
        copyBoard['name'] = updatedBoardName;

        const newProject = { ...prev, contents: { ...prev.contents, [`${boardKey}`]: copyBoard } };
        const fireProcess = async () => {
          await updateProject(project.id, newProject);
        };
        fireProcess();
        return newProject;
      });
    },
    [updatedBoardName],
  );

  return (
    <>
      <Draggable draggableId={boardKey} index={index}>
        {(provided) => (
          <Container {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            <Header>
              <EditRemoveBox
                onEdit={onBoardNameEditVarSubmit}
                onInputChange={onBoardNameEditVarChange}
                inputValue={updatedBoardName}
                text={board?.name}
                onDelete={onBoardDelete}
              />
            </Header>

            <Droppable droppableId={boardKey}>
              {(provided, snapshot) => (
                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                  {board?.tasks?.map((task, idx) => (
                    <Task boardKey={boardKey} task={task} idx={idx} key={task.id} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
            {addNewTaskMode ? (
              <div>
                <Input onSubmit={onTaskSubmit} onChange={onTaskChanged} value={newTask} placeholder="할 일 추가" />

                <button onClick={() => setAddNewTaskMode(false)}>
                  <FontAwesomeIcon icon={faX} size="sm" />
                </button>
              </div>
            ) : (
              <Add onClick={() => setAddNewTaskMode(true)}>+ 새로 만들기</Add>
            )}
          </Container>
        )}
      </Draggable>
    </>
  );
}

export default React.memo(Board);
