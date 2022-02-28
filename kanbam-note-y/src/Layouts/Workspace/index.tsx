import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import Work from '../../Components/Work';
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
  return (
    <div>
      <Header>
        {true && (
          <RightMenu>
            <span>{user.name}</span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces></Workspaces>
        <Channels>
          <MenuScroll></MenuScroll>
        </Channels>
        <Chats>
          <Work />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
