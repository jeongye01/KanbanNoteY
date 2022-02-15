import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { boardsState } from "./atoms";
import { useRecoilState } from "recoil";
import styled from "styled-components";
const Container = styled.div`
  display: flex;
`;
const Letsgo = styled.div`
  display: flex;
  width: 150px;
  height: 150px;
  margin-right: 15px;
  background-color: green;
`;
function Home() {
  const [boards, setBoards] = useRecoilState(boardsState);
  const onDragEnd = () => {
    console.log("drag ENd");
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {(magic) => (
            <ul ref={magic.innerRef} {...magic.droppableProps}>
              <Draggable draggableId="first" index={0}>
                {(magic) => (
                  <li ref={magic.innerRef} {...magic.draggableProps}>
                    <span {...magic.dragHandleProps}>🔥</span>
                    One
                  </li>
                )}
              </Draggable>
              <Draggable draggableId="two" index={1}>
                {(magic) => (
                  <li ref={magic.innerRef} {...magic.draggableProps}>
                    <span {...magic.dragHandleProps}>🔥</span>
                    One
                  </li>
                )}
              </Draggable>
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default Home;
