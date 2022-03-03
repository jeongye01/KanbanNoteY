import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { userState } from '../../Atoms/user';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import Workspace from '../../Layouts/Workspace';
import styled from 'styled-components';
import Board from '../../Components/Board';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import { IboardsOrder, IProject } from '../../Typings/db';
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  display: flex;
`;

function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  console.log(projectId, 'project');
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
      const newProject = {
        ...prev,
        contents: { ...prev.contents, [`${id}`]: { name: newBoardName, tasks: [] } },
      };
      updateProject(project.id, newProject);
      return newProject;
    });

    setBoardsOrder((prev) => {
      console.log(id);
      const newBoardsOrder = { ...prev, order: [...prev.order, id.toString()] };
      updateBoardsOrder(project.id, newBoardsOrder);
      return newBoardsOrder;
    });
  };

  const updateProject = async (id: string, newProject: IProject) => {
    await setDoc(doc(db, 'projects', id), {
      ...newProject,
    });
  };
  const updateBoardsOrder = async (id: string, newBoardsOrder: IboardsOrder) => {
    await setDoc(doc(db, 'boardsOrders', id), {
      ...newBoardsOrder,
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

      setBoardsOrder((prev) => {
        const newBoardsOrder = { ...prev, order: newOrder };
        updateBoardsOrder(project.id, newBoardsOrder);
        return newBoardsOrder;
      });

      return;
    }

    const sourceTasksCopy = [...project.contents[source.droppableId].tasks];
    const taskObj = sourceTasksCopy[source.index];
    const sourceName = project.contents[source.droppableId].name;
    sourceTasksCopy.splice(source.index, 1);
    if (destination.droppableId === source.droppableId) {
      sourceTasksCopy.splice(destination.index, 0, taskObj);
      setProject((prev) => {
        const newProject = {
          ...prev,
          contents: { ...prev.contents, [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy } },
        };
        updateProject(project.id, newProject);
        return newProject;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      const destinationTasksCopy = [...project.contents[destination.droppableId].tasks];
      const destinationName = project.contents[destination.droppableId].name;
      destinationTasksCopy.splice(destination.index, 0, taskObj);
      setProject((prev) => {
        const newProject = {
          ...prev,
          contents: {
            ...prev.contents,
            [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy },
            [destination.droppableId]: { name: destinationName, tasks: destinationTasksCopy },
          },
        };
        updateProject(project.id, newProject);
        return newProject;
      });
    }
  };
  const fetchProject = async (projectId: string) => {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { id, name, contents } = docSnap.data();
      setProject({ id, name, contents });
    }
  };
  const fetchBoardsOrder = async (projectId: string) => {
    const docRef = doc(db, 'boardsOrder', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { projectId, order } = docSnap.data();
      setBoardsOrder({ projectId, order });
    }
  };
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchBoardsOrder(projectId);
    }
  }, [projectId]);
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
