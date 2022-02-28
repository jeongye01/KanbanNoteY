import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, boardsState } from '../atoms';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { useState } from 'react';
import Workspace from '../Layouts/Workspace';
import styled from 'styled-components';
import Board from './Board';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  display: flex;
`;

function Work() {
  const [boards, setBoards] = useRecoilState(boardsState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  console.log(boardsOrder);
  const onNewBoardSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = Date.now();

    setBoards((allBoards) => {
      console.log(id);
      const updatedBoards = { ...allBoards, [`${id}`]: { name: newBoardName, tasks: [] } };

      return updatedBoards;
    });
    setBoardsOrder((allBoards) => {
      console.log(id);
      return [...allBoards, id.toString()];
    });
  };
  const onNewBoardChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewBoardName(event.currentTarget.value);
  };
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source, type } = result;
    console.log(destination, source);
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (type === 'column') {
      const newOrder = Array.from(boardsOrder);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);

      setBoardsOrder(newOrder);
      return;
    }

    const sourceTasksCopy = [...boards[source.droppableId].tasks];
    const taskObj = sourceTasksCopy[source.index];
    const sourceName = boards[source.droppableId].name;
    sourceTasksCopy.splice(source.index, 1);
    if (destination.droppableId === source.droppableId) {
      sourceTasksCopy.splice(destination.index, 0, taskObj);
      setBoards((prev) => ({ ...prev, [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy } }));
    }
    if (destination.droppableId !== source.droppableId) {
      const destinationTasksCopy = [...boards[destination.droppableId].tasks];
      const destinationName = boards[destination.droppableId].name;
      destinationTasksCopy.splice(destination.index, 0, taskObj);
      setBoards((prev) => ({
        ...prev,
        [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy },
        [destination.droppableId]: { name: destinationName, tasks: destinationTasksCopy },
      }));
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-boards" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {boardsOrder?.map((boardId, index) => (
                <Board board={boards[boardId]} key={boardId} boardKey={boardId} index={index} />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <form onSubmit={onNewBoardSubmit}>
        <input onChange={onNewBoardChange} name="newBoard" type="text" placeholder="Enter list title..." />
        <input type="submit" value="Add list" />
      </form>
    </>
  );
}

export default Work;
