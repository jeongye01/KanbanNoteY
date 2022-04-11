import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import Board from '../../Components/Board';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import { IboardInfo, IboardsOrder, IProject } from '../../Typings/db';
import { Container, AddBoard, AddBoardInput, AddBoardSubmit, Bubble, DotWrapper, Dot } from './styles';
import { userState } from '../../Atoms/user';
function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const user = useRecoilValue(userState);
  console.log('Project');

  const onNewBoardSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newBoardName || !newBoardName.trim()) return;
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
    },
    [newBoardName],
  );

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
  const onNewBoardChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewBoardName(event.currentTarget.value);
  }, []);
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

  const fetchProjectData = useCallback(
    async (projectId: string) => {
      setLoading(true);
      const orderRef = doc(db, 'boardsOrders', projectId);
      const boardsRef = doc(db, 'projects', projectId);
      const orderSnap = await getDoc(orderRef);
      const boardsSnap = await getDoc(boardsRef);

      if (orderSnap.exists() && boardsSnap.exists()) {
        const { id, name, contents } = boardsSnap.data();
        const { projectId, order } = orderSnap.data();
        setProject({ id, name, contents });
        setBoardsOrder({ projectId, order });
      }
    },
    [projectId],
  );

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [fetchProjectData]);
  useEffect(() => {
    if (project.id === boardsOrder.projectId) {
      setLoading(false);
    }
  }, [project, boardsOrder]);
  return (
    <>
      {user?.projects?.length > 0 ? (
        <>
          {!loading ? (
            <Container>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-boards" direction="horizontal" type="column">
                  {(provided) => (
                    <Container {...provided.droppableProps} ref={provided.innerRef}>
                      {boardsOrder?.order?.map((boardId, index) => {
                        const board = project.contents[boardId];
                        return <Board board={board} key={boardId} boardKey={boardId} index={index} />;
                      })}
                      {provided.placeholder}
                    </Container>
                  )}
                </Droppable>
              </DragDropContext>
              <AddBoard as="form" onSubmit={onNewBoardSubmit}>
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
          ) : (
            <div
              style={{
                padding: '1rem',
              }}
            >
              <DotWrapper>
                <Dot delay="0s" />
                <Dot delay=".1s" />
                <Dot delay=".2s" />
              </DotWrapper>
            </div>
          )}
        </>
      ) : (
        <span>
          {' '}
          <Bubble>
            <span>&larr;프로젝트를 추가해 주세요!</span>
            <span>👻</span>
          </Bubble>
        </span>
      )}
    </>
  );
}

export default Project;

/*
   <Board board={board} key={`${board.name}-${index}`} index={index} />
*/
