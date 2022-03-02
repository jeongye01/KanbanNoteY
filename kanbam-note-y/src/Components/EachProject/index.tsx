import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';

interface Props {
  projectId: string;
}
function EachProject({ projectId }: Props) {
  return (
    <NavLink activeClassName="selected" to={`/project/${projectId}`}>
      <span>project</span>
    </NavLink>
  );
}

export default EachProject;
