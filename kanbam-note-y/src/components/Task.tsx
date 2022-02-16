import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boardsOrderState, boardsState, Itask } from '../atoms';
import { useSetRecoilState } from 'recoil';
const List = styled.li<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightGreen' : 'white')};
`;

interface Iprops {
  boardKey: string;
  task: Itask;
  idx: number;
}
function Task({ boardKey, task, idx }: Iprops) {
  const [updatedTaskName, setUpdatedTaskName] = useState<string>(task.content);
  const [isEditActive, setIsEditActive] = useState<boolean>(false);

  const setBoards = useSetRecoilState(boardsState);

  const onTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBoards((prev) => {
      const copyBoard = { ...prev[boardKey] };
      const copyTasks = [...copyBoard.tasks];
      const { id } = copyTasks[idx];
      copyTasks.splice(idx, 0, { id, content: updatedTaskName });
      copyTasks.splice(idx + 1, 1);

      return { ...prev, [`${boardKey}`]: { name: copyBoard.name, tasks: copyTasks } };
    });
    setIsEditActive(false);
  };
  const onTaskChanged = (event: React.FormEvent<HTMLInputElement>) => {
    setUpdatedTaskName(event.currentTarget.value);
  };

  const onTaskDelete = () => {
    setBoards((prev) => {
      const copyBoard = { ...prev[boardKey] };
      const copyTasks = [...copyBoard.tasks];

      copyTasks.splice(idx, 1);

      return { ...prev, [`${boardKey}`]: { name: copyBoard.name, tasks: copyTasks } };
    });
  };
  return (
    <Draggable draggableId={`${task.id}`} index={idx}>
      {(provided, snapshot) => (
        <List
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          {isEditActive ? (
            <form onSubmit={onTaskSubmit}>
              <input onChange={onTaskChanged} type="text" value={updatedTaskName} />
              <input type="submit" value="저장" />
            </form>
          ) : (
            <>
              <span>🔥{task.content}</span>
              <button onClick={() => setIsEditActive(true)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button onClick={onTaskDelete}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </>
          )}
        </List>
      )}
    </Draggable>
  );
}

export default React.memo(Task);
