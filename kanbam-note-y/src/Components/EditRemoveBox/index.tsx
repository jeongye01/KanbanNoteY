import React, { useCallback, useEffect } from 'react';
import Input from '../Input';
import { faEllipsis, faTrashCan, faPenSquare, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from './styles';
import { displayPartsToString } from 'typescript';

interface Props {
  onEdit: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.FormEvent<HTMLInputElement>) => void;
  inputValue: string;
  text: string;
  onDelete: () => void;

  link?: string;
}

function EditRemoveBox({ onEdit, onInputChange, inputValue, text, onDelete, link }: Props) {
  console.log('EditRemoveBox', text);
  const [ellipsisClicked, setEllipsisClicked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onEdit(event);
    setEllipsisClicked(false);
    setEditMode(false);
  };

  return (
    <Container>
      {ellipsisClicked && editMode ? (
        <Input onChange={onInputChange} onSubmit={onSubmit} value={inputValue} placeholder={text} />
      ) : (
        <>
          {link ? (
            <NavLink activeClassName="selected" to={link}>
              <span>{text}</span>
            </NavLink>
          ) : (
            <span>{text}</span>
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

export default React.memo(EditRemoveBox);
