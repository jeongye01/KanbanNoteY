import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { projectState } from '../../Atoms/project';
import { useRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import Board from '../../Components/Board';
import { doc } from 'firebase/firestore';
import { db, updateProject } from '../../firebase';
import { useParams } from 'react-router-dom';
import { Container, AddBoard, AddBoardInput, AddBoardSubmit, Bubble, DotWrapper, Dot } from './styles';
import { IProject, Itask } from '../../Typings/db';
import { onSnapshot } from 'firebase/firestore';
import useUser from '../../utils/useUser';
function Project() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const onNewBoardSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!projectId) return;
      if (!newBoardName.trim()) return;
      const id = Date.now() + '';

      const newProject: IProject = {
        ...project,
        boards: { ...project.boards, [id]: { name: newBoardName, tasks: [] } },
        boardsOrder: [...project.boardsOrder, id],
      };
      const createBoard = async () => updateProject(projectId, newProject);
      createBoard();

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

    if (!destination) return;
    //들었다가 다시 제자리에 두는 경우
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    //board 위치 바꾸기
    if (type === 'column') {
      const newOrder = Array.from(project.boardsOrder);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);

      const newProject: IProject = { ...project, boardsOrder: newOrder };
      //optimistic ui
      setProject(newProject);
      const updateBoardsOrder = async () => updateProject(projectId, newProject);
      updateBoardsOrder();
    }

    //task 위치 바꾸기

    //source board 처리
    const sourceTasksCopy: Itask[] = [...project.boards[source.droppableId].tasks];
    const taskObj: Itask = sourceTasksCopy[source.index];
    const sourceName = project.boards[source.droppableId].name;
    sourceTasksCopy.splice(source.index, 1);

    //같은 보드에서 이동
    if (destination.droppableId === source.droppableId) {
      sourceTasksCopy.splice(destination.index, 0, taskObj);

      const newProject: IProject = {
        ...project,
        boards: { ...project.boards, [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy } },
      };
      //optimistic ui
      setProject(newProject);
      const updateTaskOrder = async () => updateProject(projectId, newProject);
      updateTaskOrder();
    }

    //다른 보드로 이동
    if (destination.droppableId !== source.droppableId) {
      const destinationTasksCopy: Itask[] = [...project.boards[destination.droppableId].tasks];
      const destinationName: string = project.boards[destination.droppableId].name;
      destinationTasksCopy.splice(destination.index, 0, taskObj);

      const newProject: IProject = {
        ...project,
        boards: {
          ...project.boards,
          [source.droppableId]: { name: sourceName, tasks: sourceTasksCopy },
          [destination.droppableId]: { name: destinationName, tasks: destinationTasksCopy },
        },
      };
      //optimistic ui
      setProject(newProject);
      const updateTaskOrder = async () => updateProject(projectId, newProject);
      updateTaskOrder();
    }
  };

  useEffect(() => {
    if (!projectId) return;

    const unsub = onSnapshot(doc(db, 'projects', projectId), (doc) => {
      const result = doc.data() as IProject;
      if (result) {
        console.log(result);
        setProject(result);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [projectId]);

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
                      {project?.boardsOrder?.map((boardId, index) => {
                        const board = project.boards[boardId];
                        return <Board board={board} boardId={boardId} key={boardId} index={index} />;
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
          {-1 > 0 ? <span>&larr;일을 시작하세요!👻</span> : <span>&larr;프로젝트를 추가해 주세요!👻</span>}
        </Bubble>
      )}
    </>
  );
}

export default Project;
