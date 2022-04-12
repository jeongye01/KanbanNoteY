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
  const result = signInWithEmailAndPassword(auth, email, password)
    .then(
      (userCredential) => {
        // Signed in

        return '로그인 성공';
      },
      // ...
    )
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode + '' === 'auth/user-not-found') {
        return '존재하지 않는 이메일 입니다';
      } else if (errorCode + '' === 'auth/wrong-password') {
        return '비밀번호가 일치하지 않습니다';
      } else {
        return '알 수 없는 오류가 발생했습니다.';
      }
    });
  return result;
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
