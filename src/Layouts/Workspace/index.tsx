import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import gravatar from 'gravatar';
import { useResetRecoilState } from 'recoil';
import Menu from '../../Components/Menu';
import ProjectList from '../../Components/ProjectList';
import AddProjectModal from '../../Components/AddProjectModal';
import { logout } from '../../firebase';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { projectState, projectsState } from '../../Atoms/project';
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
  ServiceName,
  WorkspaceWrapper,
} from './styles';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import useUser from '../../utils/useUser';
interface Props {
  children: React.ReactNode;
}
const Workspace = ({ children }: Props) => {
  const history = useHistory();
  const { user } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const resetProject = useResetRecoilState(projectState);
  const resetProjects = useResetRecoilState(projectsState);

  const onClickUserMenu = useCallback(() => setShowUserMenu((prev) => !prev), []);
  const onClickLogout = useCallback(() => {
    logout();
    resetProject();
    resetProjects();
    history.push('/login');
  }, []);

  return (
    <div>
      <Helmet>
        <title>Yanban</title>
        <link rel="icon" type="image/png" href="favicon.ico" sizes="16x16" />
        <meta name="description" content="kanban note" />
      </Helmet>

      <Header>
        {user && (
          <RightMenu>
            <span onClick={onClickUserMenu}>
              <ProfileImg src={gravatar.url(user?.email || '', { s: '28px', d: 'mp' })} alt={user?.displayName || ''} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserMenu}>
                <ProfileModal>
                  <img src={gravatar.url(user?.email || '', { s: '36px', d: 'mp' })} alt={user.displayName || ''} />
                  <div>
                    <span id="profile-name">{user?.displayName || ''}</span>
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
          <ServiceName>Yanban ✅</ServiceName>
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
                style={{ left: 210, top: 155 }}
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
