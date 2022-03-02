import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { userState } from '../../Atoms/user';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useState } from 'react';
import Workspace from '../../Layouts/Workspace';
import styled from 'styled-components';
import Board from '../../Components/Board';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  display: flex;
`;

function Project() {
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const user = useRecoilValue(userState);
  console.log(boardsOrder);
  const onNewBoardSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = Date.now();

    setProject((prev) => {
      console.log(id);
      return {
        ...prev,
        contents: { ...prev.contents, [`${id}`]: { name: newBoardName, tasks: [] } },
      };
    });
    await setDoc(doc(db, 'project', project.id), {
      ...project,
    });
    setBoardsOrder((prev) => {
      console.log(id);
      const order = prev.order;

      return { ...prev, order: [...prev.order, id.toString()] };
    });
    await setDoc(doc(db, 'boardsOrder', project.id), {
      ...boardsOrder,
    });
  };
  const onNewBoardChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewBoardName(event.currentTarget.value);
  };
  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId, source, type } = result;
    console.log(destination, source);
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (type === 'column') {
      const newOrder = Array.from(boardsOrder.order);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);

      setBoardsOrder((prev) => ({ ...prev, order: newOrder }));
      await setDoc(doc(db, 'boardsOrder', project.id), {
        ...boardsOrder,
      });
      return;
    }

    const sourceTasksCopy = [...project.contents[source.droppableId].tasks];
    const taskObj = sourceTasksCopy[source.index];
    const sourceName = project.contents[source.droppableId].name;
    sourceTasksCopy.splice(source.index, 1);
    if (destination.droppableId === source.droppableId) {
      sourceTasksCopy.splice(destination.index, 0, taskObj);
      setProject((prev) => ({
        ...prev,
        contents: { ...prev.contents, [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy } },
      }));
      await setDoc(doc(db, 'project', project.id), {
        ...project,
      });
    }
    if (destination.droppableId !== source.droppableId) {
      const destinationTasksCopy = [...project.contents[destination.droppableId].tasks];
      const destinationName = project.contents[destination.droppableId].name;
      destinationTasksCopy.splice(destination.index, 0, taskObj);
      setProject((prev) => ({
        ...prev,
        contents: {
          ...prev.contents,
          [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy },
          [destination.droppableId]: { name: destinationName, tasks: destinationTasksCopy },
        },
      }));
      await setDoc(doc(db, 'project', project.id), {
        ...project,
      });
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-boards" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {boardsOrder.order?.map((boardId, index) => (
                <Board board={project.contents[boardId]} key={boardId} boardKey={boardId} index={index} />
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

export default Project;
