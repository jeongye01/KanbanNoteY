import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { IboardInfo, Itask } from '../atoms';
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
  board: IboardInfo;
  index: number;
}
function Board({ board, boardKey, index }: Iprops) {
  console.log(boardKey, 'render');
  return (
    <Draggable draggableId={boardKey} index={index}>
      {(provided) => (
        <Container {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
          <Title>{board.name}</Title>
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
