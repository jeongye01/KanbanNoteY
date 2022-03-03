import React, { useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { IProject } from '../../Typings/db';
interface Props {
  projectId: string;
}
function EachProject({ projectId }: Props) {
  const [project, setProject] = useState<IProject>();
  const fetchProject = async () => {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { id, name, contents } = docSnap.data();
      setProject({ id, name, contents });
    }
  };
  useEffect(() => {
    fetchProject();
  }, []);
  return (
    <>
      {project ? (
        <NavLink activeClassName="selected" to={`/project/${projectId}`}>
          <span>{project.name}</span>
        </NavLink>
      ) : null}
    </>
  );
}

export default EachProject;
