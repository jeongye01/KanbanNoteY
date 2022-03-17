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
  display: flex;
`;

const AddBoard = styled.form`
  margin-top: 10px;
  display: block;
  width: 270px;
  min-width: 270px;
  height: 62px;
  border: 0;
  background-color: ${(props) => props.theme.outerbgColor};
  border-bottom-left-radius: 41px;
  border-bottom-right-radius: 41px;
  border-top-left-radius: 41px;
  border-top-right-radius: 0;
  box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.07);
  margin-bottom: 22px;
  font-size: 17px;
  color: #a7b4c1;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out, box-shadow 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  input {
    height: 25px;
  }
`;
const AddBoardInput = styled.input`
  border: 2px solid black;
  padding-left: 10px;
  font-size: 15px;
  border-right: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const AddBoardSubmit = styled.input`
  border: 2px solid black;

  background-color: orange;
  font-size: 18px;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;
function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');

  console.log(boardsOrder, project, 'init');

  const onNewBoardSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newBoardName) {
      const id = Date.now();

      setProject((prev) => {
        console.log(id);
        const newProject = {
          ...prev,
          contents: { ...prev.contents, [`${id}`]: { name: newBoardName, tasks: [] } },
        };
        updateProject(newProject);
        return newProject;
      });

      setBoardsOrder((prev) => {
        console.log(id);
        const newBoardsOrder = { ...prev, order: [...prev.order, id.toString()] };
        updateBoardsOrder(newBoardsOrder);
        return newBoardsOrder;
      });
      setNewBoardName('');
    }
  };

  const updateProject = async (newProject: IProject) => {
    if (projectId) {
      await setDoc(doc(db, 'projects', projectId), {
        ...newProject,
      });
    }
  };
  const updateBoardsOrder = async (newBoardsOrder: IboardsOrder) => {
    if (projectId) {
      await setDoc(doc(db, 'boardsOrders', projectId), {
        ...newBoardsOrder,
      });
    }
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
        updateBoardsOrder(newBoardsOrder);

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
        updateProject(newProject);
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
        updateProject(newProject);
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
    const docRef = doc(db, 'boardsOrders', projectId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('order', boardsOrder);
      const { projectId, order } = docSnap.data();

      setBoardsOrder({ projectId, order });
    }
  };
  useEffect(() => {
    if (projectId) {
      fetchBoardsOrder(projectId);
      fetchProject(projectId);
    }
  }, [projectId]);
  return (
    <>
      {project.id === boardsOrder.projectId ? (
        <Container>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-boards" direction="horizontal" type="column">
              {(provided) => (
                <Container {...provided.droppableProps} ref={provided.innerRef}>
                  {boardsOrder?.order?.map((boardId, index) => (
                    <Board board={project.contents[boardId]} key={boardId} boardKey={boardId} index={index} />
                  ))}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
          <AddBoard onSubmit={onNewBoardSubmit}>
            <AddBoardInput
              onChange={onNewBoardChange}
              value={newBoardName}
              name="newBoard"
              type="text"
              placeholder="보드 추가"
            />
            <AddBoardSubmit type="submit" value="+" />
            <span>👻</span>
          </AddBoard>
        </Container>
      ) : null}
    </>
  );
}

export default Project;
