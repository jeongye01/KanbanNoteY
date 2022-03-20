import { CreateModal, CloseModalButton } from './styles';

import React from 'react';

interface Props {
  children: React.ReactNode;
}
const Modal = ({ children }: Props) => {
  console.log('Modal');
  return (
    <CreateModal>
      <div>
        <CloseModalButton>&times;</CloseModalButton>
      </div>
      {children}
    </CreateModal>
  );
};

export default React.memo(Modal);
