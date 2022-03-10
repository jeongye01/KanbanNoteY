import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import gravatar from 'gravatar';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { userState, isLoggedIn } from '../../Atoms/user';
import Project from '../../Pages/Project';
import Menu from '../../Components/Menu';
import Modal from '../../Components/Modal';
import ProjectList from '../../Components/ProjectList';
import AddProjectModal from '../../Components/AddProjectModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, logout, userLogin } from '../../firebase';
import { useParams } from 'react-router-dom';
import { IboardsOrder, IProject } from '../../Typings/db';
import { projectState, boardsOrderState } from '../../Atoms/project';
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
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Workspace = () => {
  const history = useHistory();
  const user = useRecoilValue(userState);
  const setIsLoggedIn = useSetRecoilState(isLoggedIn);
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useRecoilState(projectState);
  const [boardsOrder, setBoardsOrder] = useRecoilState(boardsOrderState);
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
                <LogOutButton
                  onClick={() => {
                    setIsLoggedIn(false);
                    logout();
                  }}
                >
                  로그아웃
                </LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Channels>
          <WorkspaceName>Yanban ✅</WorkspaceName>
          <MenuScroll>
            <AddProject>
              <span>Your Projects</span>
              <button onClick={() => setShowAddProjectModal((prev) => !prev)}>
                {showAddProjectModal ? (
                  <FontAwesomeIcon icon={faCircleXmark} />
                ) : (
                  <FontAwesomeIcon icon={faCirclePlus} />
                )}
              </button>
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
                <AddProjectModal />
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
