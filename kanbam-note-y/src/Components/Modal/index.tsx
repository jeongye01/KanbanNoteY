import { CreateModal, CloseModalButton } from './styles';

import React, { useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children: React.ReactNode;
}
const Modal = ({ show, onCloseModal, children }: Props) => {
  return (
    <CreateModal>
      <div>
        <CloseModalButton>&times;</CloseModalButton>
      </div>
      {children}
    </CreateModal>
  );
};

export default Modal;
