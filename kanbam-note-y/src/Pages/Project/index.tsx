import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import Board from '../../Components/Board';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useHistory, useParams } from 'react-router-dom';
import { defaultBoardsOrder, defaultProjectContents, IboardInfo, IboardsOrder, IProject } from '../../Typings/db';
import { Container, AddBoard, AddBoardInput, AddBoardSubmit, Bubble, DotWrapper, Dot } from './styles';
import { userState } from '../../Atoms/user';
function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>();
  const resetProject = useResetRecoilState(projectState);
  const resetBoardsOrder = useResetRecoilState(boardsOrderState);
  const user = useRecoilValue(userState);
  console.log('Project');
  const history = useHistory();

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
      const orderRef = doc(db, 'boardsOrders', projectId);
      const boardsRef = doc(db, 'projects', projectId);
      const orderSnap = await getDoc(orderRef);
      const boardsSnap = await getDoc(boardsRef);
      setLoading(true);
      if (orderSnap.exists() && boardsSnap.exists()) {
        const { id, name, contents } = boardsSnap.data();
        const { projectId, order } = orderSnap.data();
        setProject({ id, name, contents });
        setBoardsOrder({ projectId, order });
      } else {
        //유효하지 않은 url //url이 깜빡거린다면 firebase가 변동사항이 업데이트 되지 않아서 유효해도 유효하지 않다고 판단해서 "/"로 갔다가 다시 돌아온거임
        //첫번째 프로젝트 생성시 url이 깜빡거릴수 있음
        history.push('/');
      }
    },
    [projectId],
  );

  useEffect(() => {
    if (projectId) {
      console.log(projectId);
      fetchProjectData(projectId);
    } else {
      if (!user.projects[0]) {
        resetProject();
        resetBoardsOrder();
      } else {
        history.push(`/project/${user.projects[0].id}`); //“/” 일 경우유저 프로젝트가 있으면 첫번째 프로젝트 url 로 보냄
      }
    }
  }, [fetchProjectData]);
  useEffect(() => {
    if (project.id === boardsOrder.projectId && history.location.pathname !== '/') {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [project, boardsOrder]);

  return (
    <>
      {projectId ? (
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
        <Bubble>
          {user.projects.length > 0 ? (
            <span>&larr;일을 시작하세요!👻</span>
          ) : (
            <span>&larr;프로젝트를 추가해 주세요!👻</span>
          )}
        </Bubble>
      )}
    </>
  );
}

export default Project;

/*
   <Board board={board} key={`${board.name}-${index}`} index={index} />
*/
