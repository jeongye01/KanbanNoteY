import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import gravatar from 'gravatar';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import Work from '../../Pages/Project';
import Menu from '../../Components/Menu';
import Modal from '../../Components/Modal';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';

const Workspace = () => {
  const user = useRecoilValue(userState);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div>
      <Header>
        {true && (
          <RightMenu>
            <ProfileImg src={gravatar.url(user.email, { s: '28px', d: 'retro' })} alt={user.name} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={() => setShowUserMenu(false)}>
                <ProfileModal>
                  <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.name} />
                  <div>
                    <span id="profile-name">{user.name}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Channels>
          <WorkspaceName>Yanban</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Work />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
