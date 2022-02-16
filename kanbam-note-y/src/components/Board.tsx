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
const Title = styled.h3`
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
  const [isModalOpen, setModalOpen] = useState<boolean>();
  const setBoards = useSetRecoilState(boardsState);
  const setBoardsOrder = useSetRecoilState(boardsOrderState);
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
  const onEdit = () => {};
  return (
    <Draggable draggableId={boardKey} index={index}>
      {(provided) => (
        <Container {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
          <Header>
            <Title>{board.name}</Title>
            <button onClick={() => setModalOpen((prev) => !prev)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {isModalOpen ? (
              <Modal>
                <button onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashCan} /> 삭제
                </button>
                <button onClick={onEdit}>
                  <FontAwesomeIcon icon={faPenToSquare} /> 이름 바꾸기
                </button>
              </Modal>
            ) : null}
          </Header>
          <Droppable droppableId={boardKey}>
            {(provided, snapshot) => (
              <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                {board?.tasks?.map((task, idx) => (
                  <Task task={task} idx={idx} key={task.id} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
