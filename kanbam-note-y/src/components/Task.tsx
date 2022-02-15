import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Itask } from '../atoms';
import styled from 'styled-components';

const List = styled.li<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightGreen' : 'white')};
`;

interface Iprops {
  task: Itask;
  idx: number;
}
function Task({ task, idx }: Iprops) {
  console.log(task.content, 'render');
  return (
    <Draggable draggableId={`${task.id}`} index={idx}>
      {(provided, snapshot) => (
        <List
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <span>🔥{task.content}</span>
        </List>
      )}
    </Draggable>
  );
}

export default React.memo(Task);
