import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import Board from '../../Components/Board';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, updateProject, updateBoardsOrder } from '../../firebase';
import { useHistory, useParams } from 'react-router-dom';
import { Container, AddBoard, AddBoardInput, AddBoardSubmit, Bubble, DotWrapper, Dot } from './styles';
import { userState } from '../../Atoms/user';
import { defaultProjectContents, defaultBoardsOrder } from '../../Typings/db';
function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const resetProject = useResetRecoilState(projectState);
  const resetBoardsOrder = useResetRecoilState(boardsOrderState);
  const user = useRecoilValue(userState);
  console.log('Project');
  const history = useHistory();

  const onNewBoardSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!projectId) return;
      if (!newBoardName.trim()) return;
      const id = Date.now();
      setProject((prev) => {
        console.log(id);
        const newProject = {
          ...prev,
          contents: { ...prev.contents, [`${id}`]: { name: newBoardName, tasks: [] } },
        };
        const fireProcess = async () => updateProject(projectId, newProject);
        fireProcess();
        return newProject;
      });
      setBoardsOrder((prev) => {
        console.log(id);
        const newBoardsOrder = { ...prev, order: [...prev.order, id.toString()] };
        const fireProcess = async () => updateBoardsOrder(projectId, newBoardsOrder);
        fireProcess();
        return newBoardsOrder;
      });
      setNewBoardName('');
    },
    [newBoardName],
  );
  const onNewBoardChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setNewBoardName(event.currentTarget.value);
  }, []);
  const onDragEnd = async (result: DropResult) => {
    if (!projectId) return;
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
        const fireProcess = async () => updateBoardsOrder(projectId, newBoardsOrder);
        fireProcess();

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
        const fireProcess = async () => updateProject(projectId, newProject);
        fireProcess();
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
        const fireProcess = async () => updateProject(projectId, newProject);
        fireProcess();
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
      if (orderSnap.exists() && boardsSnap.exists()) {
        const { id, name, contents } = boardsSnap.data();
        const { projectId, order } = orderSnap.data();
        setBoardsOrder({ projectId, order });
        setProject({ id, name, contents });
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
      fetchProjectData(projectId);
    } else {
      if (user.projects.length === 0) {
        resetProject();
        resetBoardsOrder();
      }
    }
  }, [fetchProjectData]);
  useEffect(() => {
    if (!project.id.trim() || !boardsOrder?.projectId.trim()) return;
    if (project?.id === boardsOrder?.projectId) {
      console.log(project?.id === boardsOrder?.projectId, project?.id, boardsOrder?.projectId);
      setLoading(false);
    }
  }, [project, boardsOrder]);

  return (
    <>
      {projectId ? (
        <>
          {loading ? (
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
          ) : (
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
