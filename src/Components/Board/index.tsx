import React, { useCallback, useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { projectState } from '../../Atoms/project';
import { IboardInfo, IProject } from '../../Typings/db';
import Task from '../Task';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import EditRemoveBox from '../EditRemoveBox';
import Form from '../Form';
import { Container, TaskList, Add, Header } from './styles';
import { updateProject, updateBoardsOrder } from '../../firebase';
interface Iprops {
  board: IboardInfo;
  index: number;
  boardId: string;
}
function Board({ board, boardId, index }: Iprops) {
  const project = useRecoilValue(projectState);
  //const setBoardsOrder = useSetRecoilState(boardsOrderState);
  const [updatedBoardName, setUpdatedBoardName] = useState<string>(board?.name);
  const [newTask, setNewTask] = useState<string>('');
  const [addNewTaskMode, setAddNewTaskMode] = useState<boolean>(false);

  const onTaskSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newTask || !newTask.trim()) return;
      const newTaskObj = { id: Date.now(), content: newTask };
      const newTasks = [...project.boards[boardId].tasks, newTaskObj];
      const newProject = {
        ...project,
        boards: { ...project.boards, [boardId]: { name: board.name, tasks: newTasks } },
      };
      const addNewTask = async () => {
        await updateProject(project.id, newProject);
      };
      addNewTask();

      setNewTask('');
    },
    [newTask],
  );

  const onTaskChanged = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  }, []);
  const onBoardDelete = () => {
    if (!project) return;
    const newBoards = { ...project.boards };
    const newBoardsOrder = [...project.boardsOrder];
    delete newBoards[boardId];
    newBoardsOrder.splice(index, 1);
    const newProject: IProject = { ...project, boards: newBoards, boardsOrder: newBoardsOrder };
    const deleteBoard = async () => {
      await updateProject(project.id, newProject);
    };
    deleteBoard();
  };
  const onBoardNameEditVarChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedBoardName(event.currentTarget.value);
  }, []);

  const onBoardNameEditVarSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!updatedBoardName || !updatedBoardName.trim()) return;

      let copyBoard: IboardInfo = { ...project.boards[boardId] };
      copyBoard['name'] = updatedBoardName;

      const newProject: IProject = { ...project, boards: { ...project.boards, [boardId]: copyBoard } };
      const editBoardName = async () => {
        await updateProject(project.id, newProject);
      };
      editBoardName();
    },
    [updatedBoardName],
  );

  return (
    <>
      <Draggable draggableId={boardId} index={index}>
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

            <Droppable droppableId={boardId}>
              {(provided, snapshot) => (
                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                  {board?.tasks?.map((task, idx) => (
                    <Task boardId={boardId} task={task} idx={idx} key={task.id} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
            {addNewTaskMode ? (
              <div>
                <Form onSubmit={onTaskSubmit} onChange={onTaskChanged} value={newTask} placeholder="할 일 추가" />

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
