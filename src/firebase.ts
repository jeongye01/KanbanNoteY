import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, DocumentData, doc, getDoc } from 'firebase/firestore/lite';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { defaultProjectContents, defaultBoardsOrder, IUser, IProject, IboardsOrder } from './Typings/db';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

//project
export const getProjects = async (): Promise<DocumentData[]> => {
  const projectsCol = collection(db, 'projects');
  const projectSnapshot = await getDocs(projectsCol);
  const projectList = projectSnapshot.docs.map((doc) => doc.data());
  return projectList;
};

//database

//Auth
export const auth = getAuth();
export const user = auth.currentUser;
export const createUser = (name: string, email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('Sign-out successful.');
    })
    .catch((error) => {});
};

//user
export const updateUser = async (userEmail: string, userInfo: IUser) => {
  await setDoc(doc(db, 'users', userEmail), {
    ...userInfo,
  });
};
export const addUserProject = async (id: string, user: IUser, newProjectName: string): Promise<void> => {
  await setDoc(doc(db, 'users', user.email), {
    ...user,
    projects: [...user.projects, { name: newProjectName, id }],
  });
};

//project
export const createProject = async (id: string, newProjectName: string): Promise<void> => {
  await setDoc(doc(db, 'projects', id), {
    id,
    name: newProjectName,
    contents: defaultProjectContents,
  });
};
export const editProjectName = async (id: string, newProjectName: string): Promise<boolean> => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const updatedProject = { ...data, name: newProjectName };

    await setDoc(doc(db, 'projects', id), {
      ...updatedProject,
    });
    return true;
  } else {
    return false;
  }
};
export const updateProject = async (id: string, newProject: IProject): Promise<void> => {
  await setDoc(doc(db, 'projects', id), {
    ...newProject,
  });
};

//boardOrder
export const createBoardsOrder = async (id: string): Promise<void> => {
  await setDoc(doc(db, 'boardsOrders', id), {
    projectId: id,
    order: defaultBoardsOrder,
  });
};
export const updateBoardsOrder = async (projectId: string, newBoardsOrder: IboardsOrder): Promise<void> => {
  await setDoc(doc(db, 'boardsOrders', projectId), {
    ...newBoardsOrder,
  });
};
