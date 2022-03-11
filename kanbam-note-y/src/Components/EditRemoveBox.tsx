import styled from 'styled-components';
import { EventHandler } from 'react';
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
  faPenSquare,
  faArrowRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
  }
  ul {
    display: flex;
    align-items: center;

    li {
      margin-left: 5px;
    }
  }
`;
const Title = styled.span``;
interface Props {
  onEdit: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.FormEvent<HTMLInputElement>) => void;
  inputValue: string;
  text: string;
  onDelete: () => void;
  link?: string;
}

function EditRemoveBox({ onEdit, onInputChange, inputValue, text, onDelete, link }: Props) {
  const [ellipsisClicked, setEllipsisClicked] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onEdit(event);
    setEllipsisClicked(false);
    setEditMode(false);
  };
  return (
    <Container>
      {ellipsisClicked && editMode ? (
        <form onSubmit={onSubmit}>
          <input onChange={onInputChange} type="text" value={inputValue} required />
        </form>
      ) : (
        <>
          {link ? (
            <NavLink activeClassName="selected" to={link}>
              <Title>{text}</Title>
            </NavLink>
          ) : (
            <Title>{text}</Title>
          )}
        </>
      )}

      {ellipsisClicked ? (
        <ul>
          <li onClick={() => setEditMode(true)}>
            <FontAwesomeIcon icon={faPenSquare} />
          </li>
          <li
            onClick={() => {
              onDelete();
              setEllipsisClicked(false);
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </li>

          <li
            onClick={() => {
              setEllipsisClicked(false);
              setEditMode(false);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </li>
        </ul>
      ) : (
        <button onClick={() => setEllipsisClicked(true)}>
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      )}
    </Container>
  );
}

export default EditRemoveBox;
