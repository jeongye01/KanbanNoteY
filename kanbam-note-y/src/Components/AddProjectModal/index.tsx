import Modal from '../Modal';
//import { Button, Input, Label } from '../../Pages/SignUp/styles';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
function CreateChannelModal({ show, onCloseModal, setShowCreateChannelModal }: Props) {
  const params = useParams<{ workspace?: string }>();

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form>
        <label id="channel-label">
          <span>채널 이름</span>
          <input id="channel" placeholder="input" />
        </label>
        <button>생성하기</button>
      </form>
    </Modal>
  );
}

export default CreateChannelModal;
