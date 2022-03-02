import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import gravatar from 'gravatar';
import { useRecoilValue } from 'recoil';
import { userState } from '../../Atoms/user';
import Project from '../../Pages/Project';
import Menu from '../../Components/Menu';
import Modal from '../../Components/Modal';
import ProjectList from '../../Components/ProjectList';
import AddProjectModal from '../../Components/AddProjectModal';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  AddProject,
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
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  return (
    <div>
      <Header>
        {true && (
          <RightMenu>
            <span
              onClick={() => {
                setShowUserMenu((prev) => !prev);
              }}
            >
              <ProfileImg src={gravatar.url(user.email, { s: '28px', d: 'retro' })} alt={user.name} />
            </span>
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={() => {
                  setShowUserMenu((prev) => !prev);
                }}
              >
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
          <MenuScroll>
            <AddProject>
              <span>Your Projects</span>
              <button onClick={() => setShowAddProjectModal((prev) => !prev)}>+</button>
            </AddProject>
            <ProjectList />
            {showAddProjectModal && (
              <Menu
                style={{ left: 260, top: 105 }}
                show={showAddProjectModal}
                onCloseModal={() => {
                  setShowAddProjectModal((prev) => !prev);
                }}
              >
                lalaval
              </Menu>
            )}
          </MenuScroll>
        </Channels>
        <Chats>
          <Project />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
/*

<CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={() => {
          setShowCreateChannelModal(false);
        }}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
*/
