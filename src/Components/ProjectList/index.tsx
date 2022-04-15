import ProjectItem from '../ProjectItem';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../Atoms/user';
import { getProjects } from '../../firebase';
import useUser from '../../utils/useUser';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { projectsState } from '../../Atoms/project';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  DocumentData,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { IProject } from '../../Typings/db';

function ProjectList() {
  const { user, loading } = useUser();
  const [projects, setProjects] = useRecoilState(projectsState);

  useEffect(() => {
    if (loading || !user) return;

    const q = query(collection(db, 'projects'), where('userId', '==', user.uid + ''), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result: IProject[] = [];
      querySnapshot.forEach((doc) => {
        console.log(doc);
        result.push(doc.data() as IProject);
      });
      if (result) setProjects(result);
      console.log(result, user.uid);
    });
    //
    return () => unsubscribe();
  }, [user, loading]);

  console.log(projects, user);
  return (
    <>
      <div>
        {projects?.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}

export default ProjectList;
