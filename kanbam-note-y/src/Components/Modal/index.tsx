import { CreateModal, CloseModalButton } from './styles';

import React, { useCallback } from 'react';

const Modal = () => {
  return (
    <CreateModal>
      <div>
        <CloseModalButton>&times;</CloseModalButton>
      </div>
    </CreateModal>
  );
};

export default Modal;
