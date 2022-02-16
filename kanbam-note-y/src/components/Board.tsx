import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { faEllipsis, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, boardsState, IboardInfo, Itask } from '../atoms';
import Task from './Task';
import { useSetRecoilState } from 'recoil';
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.button`
  padding: 8px;
`;
const TaskList = styled.ul<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  width: 275px;
  min-height: 100px;
`;
const Header = styled.header``;
const Modal = styled.div``;
interface Iprops {
  boardKey: string;
  board: IboardInfo;
  index: number;
}
function Board({ board, boardKey, index }: Iprops) {
  console.log(boardKey, 'render');
  const [updatedBoardName, setUpdatedBoardName] = useState<string>(board.name);
  const [isTitleEditActive, setIsTitleEditActive] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>('');
  const [isNewTaskActive, setIsNewTaskActive] = useState<boolean>(false);
  const setBoards = useSetRecoilState(boardsState);
  const setBoardsOrder = useSetRecoilState(boardsOrderState);

  const onTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBoards((prev) => {
      const newTaskObj = { id: Date.now(), content: newTask };
      const newTasks = [...prev[`${boardKey}`].tasks, newTaskObj];

      return { ...prev, [`${boardKey}`]: { name: board.name, tasks: newTasks } };
    });
    setNewTask('');
  };
  const onTaskChanged = (event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  };
  const onDelete = () => {
    setBoardsOrder((prev) => {
      const newOrder = [...prev];
      newOrder.splice(index, 1);
      return newOrder;
    });
    setBoards((prev) => {
      const newBoards = { ...prev };
      delete newBoards[`${boardKey}`];
      return newBoards;
    });
  };
  const onEditChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedBoardName(event.currentTarget.value);
  };
  const onEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBoards((prev) => {
      let copyBoard = { ...prev[`${boardKey}`] };
      copyBoard['name'] = updatedBoardName;
      console.log(copyBoard);
      return { ...prev, [`${boardKey}`]: copyBoard };
    });
    setIsTitleEditActive(false);
  };
  return (
    <Draggable draggableId={boardKey} index={index}>
      {(provided) => (
        <Container {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
          <Header>
            {isTitleEditActive ? (
              <form onSubmit={onEdit}>
                <input onChange={onEditChange} type="text" value={updatedBoardName} />
              </form>
            ) : (
              <Title onClick={() => setIsTitleEditActive(true)}>{board.name}</Title>
            )}

            <button onClick={onDelete}>
              <FontAwesomeIcon icon={faTrashCan} /> 삭제
            </button>
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
          {isNewTaskActive ? (
            <form onSubmit={onTaskSubmit}>
              <input type="text" onChange={onTaskChanged} value={newTask} placeholder="이름을 입력하세요." />
              <input type="submit" value="할 일 추가" />
              <button onClick={() => setIsNewTaskActive(false)}>x</button>
            </form>
          ) : (
            <button onClick={() => setIsNewTaskActive(true)}>+ 새로 만들기</button>
          )}
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
