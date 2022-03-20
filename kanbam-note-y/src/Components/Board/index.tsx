import React, { useCallback, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { IboardInfo, IboardsOrder, IProject } from '../../Typings/db';
import Task from '../Task';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import EditRemoveBox from '../EditRemoveBox';
import Input from '../Input';
import { Container, TaskList, Add, Header } from './styles';

interface Iprops {
  boardKey: string;
  board: IboardInfo;
  index: number;
}
function Board({ board, boardKey, index }: Iprops) {
  console.log('Board');

  const [updatedBoardName, setUpdatedBoardName] = useState<string>(board.name);
  const [newTask, setNewTask] = useState<string>('');
  const [isNewTaskActive, setIsNewTaskActive] = useState<boolean>(false);
  const [project, setProject] = useRecoilState(projectState);
  const setBoardsOrder = useSetRecoilState(boardsOrderState);

  const onTaskSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (newTask) {
        setProject((prev) => {
          const newTaskObj = { id: Date.now(), content: newTask };
          const newTasks = [...prev.contents[`${boardKey}`].tasks, newTaskObj];
          const newProject = {
            ...prev,
            contents: { ...prev.contents, [`${boardKey}`]: { name: board.name, tasks: newTasks } },
          };
          updateProject(project.id, newProject);

          return newProject;
        });

        setNewTask('');
      }
    },
    [newTask],
  );
  const updateProject = async (id: string, newProject: IProject) => {
    -(await setDoc(doc(db, 'projects', id), {
      ...newProject,
    }));
  };
  const updateBoardsOrder = async (id: string, newBoardsOrder: IboardsOrder) => {
    await setDoc(doc(db, 'boardsOrders', project.id), {
      ...newBoardsOrder,
    });
  };
  const onTaskChanged = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  }, []);
  const onDelete = async () => {
    setBoardsOrder((prev) => {
      const newOrder = [...prev.order];
      newOrder.splice(index, 1);
      const newBoardsOrder = { ...prev, order: newOrder };
      updateBoardsOrder(project.id, newBoardsOrder);
      return newBoardsOrder;
    });
    setProject((prev) => {
      const newBoards = { ...prev.contents };
      delete newBoards[`${boardKey}`];
      const newProject = { ...prev, contents: newBoards };
      updateProject(project.id, newProject);
      return newProject;
    });
  };
  const onEditChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedBoardName(event.currentTarget.value);
  }, []);
  const onEdit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setProject((prev) => {
        let copyBoard = { ...prev.contents[`${boardKey}`] };
        copyBoard['name'] = updatedBoardName;

        const newProject = { ...prev, contents: { ...prev.contents, [`${boardKey}`]: copyBoard } };
        updateProject(project.id, newProject);
        return newProject;
      });
    },
    [updatedBoardName],
  );
  return (
    <>
      {true ? (
        <>
          <Draggable draggableId={boardKey} index={index}>
            {(provided) => (
              <Container {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                <Header>
                  <EditRemoveBox
                    onEdit={onEdit}
                    onInputChange={onEditChange}
                    inputValue={updatedBoardName}
                    text={board.name}
                    onDelete={onDelete}
                  />
                </Header>

                <Droppable droppableId={boardKey}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {board?.tasks?.map((task, idx) => (
                        <Task boardKey={boardKey} task={task} idx={idx} key={task.id} />
                      ))}
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
                {isNewTaskActive ? (
                  <div>
                    <Input onSubmit={onTaskSubmit} onChange={onTaskChanged} value={newTask} placeholder="할 일 추가" />

                    <button onClick={() => setIsNewTaskActive(false)}>
                      <FontAwesomeIcon icon={faX} size="sm" />
                    </button>
                  </div>
                ) : (
                  <Add onClick={() => setIsNewTaskActive(true)}>+ 새로 만들기</Add>
                )}
              </Container>
            )}
          </Draggable>
        </>
      ) : null}
    </>
  );
}

export default React.memo(Board);
