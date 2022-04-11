import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//database

export const db = getFirestore();

//Auth
export const auth = getAuth();
export const user = auth.currentUser;
export const createUser = (name: string, email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.uid);
      await setDoc(doc(db, 'users', email), {
        uid: user.uid,
        name,
        email,
        password,
        projects: [],
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export const userLogin = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(
      (userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log('login sucess');
      },
      // ...
    )
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('Sign-out successful.');
    })
    .catch((error) => {
      console.log('// An error happened.');
    });
};

export const updateUser = async (id: string, user: IUser, newProjectName: string): Promise<void> => {
  await setDoc(doc(db, 'users', user.email), {
    ...user,
    projects: [...user.projects, { name: newProjectName, id }],
  });
};
export const createProject = async (id: string, newProjectName: string): Promise<void> => {
  await setDoc(doc(db, 'projects', id), {
    id,
    name: newProjectName,
    contents: defaultProjectContents,
  });
};
export const createBoardsOrder = async (id: string): Promise<void> => {
  await setDoc(doc(db, 'boardsOrders', id), {
    projectId: id,
    order: defaultBoardsOrder,
  });
};

export const updateProject = async (id: string, newProject: IProject): Promise<void> => {
  -(await setDoc(doc(db, 'projects', id), {
    ...newProject,
  }));
};
export const updateBoardsOrder = async (id: string, newBoardsOrder: IboardsOrder, project: IProject): Promise<void> => {
  await setDoc(doc(db, 'boardsOrders', project.id), {
    ...newBoardsOrder,
  });
};
