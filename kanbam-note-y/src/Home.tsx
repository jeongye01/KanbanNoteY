import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, boardsState } from './atoms';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import Board from './components/Board';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;

  display: flex;
`;

function Home() {
  const [boards, setBoards] = useRecoilState(boardsState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  console.log(boardsOrder);
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

    const sourceBoard = [...boards[source.droppableId]];
    const taskObj = sourceBoard[source.index];
    sourceBoard.splice(source.index, 1);
    if (destination.droppableId === source.droppableId) {
      sourceBoard.splice(destination.index, 0, taskObj);
      setBoards((prev) => ({ ...prev, [source.droppableId]: sourceBoard }));
    }
    if (destination.droppableId !== source.droppableId) {
      const destinationBoard = [...boards[destination.droppableId]];
      destinationBoard.splice(destination.index, 0, taskObj);
      setBoards((prev) => ({
        ...prev,
        [source.droppableId]: sourceBoard,
        [destination.droppableId]: destinationBoard,
      }));
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-boards" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {boardsOrder?.map((board, index) => (
                <Board board={boards[board]} key={board} boardKey={board} index={index} />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <form>
        <input placeholder="Add another list" />
      </form>
    </>
  );
}

export default Home;
