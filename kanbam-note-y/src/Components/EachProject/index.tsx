import React, { useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { IProject } from '../../Typings/db';
import { boardsOrderState, projectState } from '../../Atoms/project';
import { useRecoilState } from 'recoil';
interface Props {
  projectId: string;
  projectName: string;
}
function EachProject({ projectId, projectName }: Props) {
  return (
    <>
      <NavLink activeClassName="selected" to={`/project/${projectId}`}>
        <span>{projectName}</span>
      </NavLink>
    </>
  );
}

export default EachProject;
