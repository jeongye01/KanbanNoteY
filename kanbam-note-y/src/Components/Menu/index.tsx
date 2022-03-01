import { CreateMenu, CloseModalButton } from './styles';
import React, { useCallback } from 'react';
import { CSSProperties } from 'styled-components';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
  children: React.ReactNode;
}

const Menu = ({ closeButton, style, show, children, onCloseModal }: Props) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
