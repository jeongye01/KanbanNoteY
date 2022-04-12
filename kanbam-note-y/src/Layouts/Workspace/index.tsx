import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import gravatar from 'gravatar';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '../../Atoms/user';
import Menu from '../../Components/Menu';
import ProjectList from '../../Components/ProjectList';
import AddProjectModal from '../../Components/AddProjectModal';
import { logout } from '../../firebase';
import { useParams } from 'react-router-dom';
import { projectState, boardsOrderState } from '../../Atoms/project';
import {
  Channels,
  MainView,
  Header,
  LogOutButton,
  MenuScroll,
  AddProject,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  WorkspaceWrapper,
} from './styles';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
interface Props {
  children: React.ReactNode;
}
const Workspace = ({ children }: Props) => {
  console.log('Workspace');
  const history = useHistory();
  const user = useRecoilValue(userState);
  const { projectId } = useParams<{ projectId?: string }>();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const resetProject = useResetRecoilState(projectState);
  const resetBoardOrder = useResetRecoilState(boardsOrderState);
  const resetUser = useResetRecoilState(userState);

  const onClickUserMenu = useCallback(() => setShowUserMenu((prev) => !prev), []);
  const onClickLogout = useCallback(() => {
    resetProject();
    resetBoardOrder();
    resetUser();
    history.push('/');
    logout();
  }, []);
  /*useEffect(() => {
    if (!projectId) {
      if (!user.projects[0]) {
        resetProject();
        resetBoardOrder();
      }
    }
  }, [projectId, user.projects]);*/
  return (
    <div>
      <Helmet>
        <title>Yanban</title>
        <link rel="icon" type="image/png" href="favicon.ico" sizes="16x16" />
        <meta name="description" content="kanban note" />
      </Helmet>
      <Header>
        {true && (
          <RightMenu>
            <span onClick={onClickUserMenu}>
              <ProfileImg src={gravatar.url(user.email, { s: '28px', d: 'retro' })} alt={user.name} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserMenu}>
                <ProfileModal>
                  <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.name} />
                  <div>
                    <span id="profile-name">{user.name}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onClickLogout}>로그아웃</LogOutButton>
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
        <MainView>{children}</MainView>
      </WorkspaceWrapper>
    </div>
  );
};

export default React.memo(Workspace);
