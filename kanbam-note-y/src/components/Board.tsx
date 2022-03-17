import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
  faPenSquare,
  faArrowRotateLeft,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, projectState } from '../Atoms/project';
import { userState } from '../Atoms/user';
import { IboardInfo, IboardsOrder, IProject, Itask } from '../Typings/db';
import Task from './Task';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import EditRemoveBox from './EditRemoveBox';
import Input from './Input';
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 5px;
  div {
    display: flex;
  }
  form {
    margin-right: 15px;
  }
  button {
    opacity: 0.5;
  }
`;

const TaskList = styled.ul<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  width: 275px;
  min-height: 100px;
`;

const Add = styled.button`
  opacity: 0.7;
`;
const Header = styled.header`
  width: 100%;
  padding: 0 5px;
  span {
    font-weight: 600;
  }
  button,
  ul {
    color: ${(props) => props.theme.buttonColor};
  }
  margin-bottom: 5px;
`;

interface Iprops {
  boardKey: string;
  board: IboardInfo;
  index: number;
}
function Board({ board, boardKey, index }: Iprops) {
  const { projectId } = useParams<{ projectId?: string }>();
  console.log(board);

  const [updatedBoardName, setUpdatedBoardName] = useState<string>(board.name);
  const [newTask, setNewTask] = useState<string>('');
  const [isNewTaskActive, setIsNewTaskActive] = useState<boolean>(false);
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const user = useRecoilValue(userState);

  const onTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
  };
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
  const onTaskChanged = (event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  };
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
  const onEditChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedBoardName(event.currentTarget.value);
  };
  const onEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProject((prev) => {
      let copyBoard = { ...prev.contents[`${boardKey}`] };
      copyBoard['name'] = updatedBoardName;

      const newProject = { ...prev, contents: { ...prev.contents, [`${boardKey}`]: copyBoard } };
      updateProject(project.id, newProject);
      return newProject;
    });
  };
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
