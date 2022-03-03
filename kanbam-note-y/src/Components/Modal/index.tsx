import { CreateModal, CloseModalButton } from './styles';

import React, { useCallback } from 'react';

interface Props {
  children: React.ReactNode;
}
const Modal = ({ children }: Props) => {
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
