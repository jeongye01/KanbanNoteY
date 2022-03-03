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
  const user = useRecoilValue(userState);

  return (
    <>
      <div>
        {user?.projects.map((project) => (
          <EachProject key={project.id} projectId={project.id} projectName={project.name} />
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
