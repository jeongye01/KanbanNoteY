import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Itask } from '../atoms';
import Task from './Task';
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
interface Iprops {
  boardKey: string;
  board: Itask[];
}
function Board({ board, boardKey }: Iprops) {
  console.log(boardKey, 'render');
  return (
    <Container>
      <Title>{boardKey}</Title>
      <Droppable droppableId={boardKey}>
        {(provided, snapshot) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
            {board.map((task, idx) => (
              <Task task={task} idx={idx} key={task.id} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}

export default React.memo(Board);
