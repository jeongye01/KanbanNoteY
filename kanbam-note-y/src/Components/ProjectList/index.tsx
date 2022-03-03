//import { CollapseButton } from '@components/DMList/styles';
import EachProject from '../EachProject';
//import { IChannel, IUser } from '@typings/db';
//import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../Atoms/user';

import AddProjectModal from '../AddProjectModal';
//import useSWR from 'swr';

function ProjectList() {
  const { workspace } = useParams<{ workspace?: string }>();
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <div>
        {user?.projectIds.map((projectId) => (
          <EachProject key={projectId} projectId={projectId} />
        ))}
      </div>
    </>
  );
}

export default ProjectList;

/*
 {user?.projectIds.map((projectId) => {
          return <EachProject key={projectId} projectId={projectId} />;
        })}

*/
