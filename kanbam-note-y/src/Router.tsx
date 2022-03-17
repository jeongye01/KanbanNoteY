import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Workspace from './Layouts/Workspace';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { userLogin, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { userState, isLoggedIn } from './Atoms/user';
import { useRecoilState } from 'recoil';
function Router() {
  const [loggedIn, setIsLoggedIn] = useRecoilState(isLoggedIn);
  const setUser = useSetRecoilState(userState);
  onAuthStateChanged(auth, async (user) => {
    console.log(user);
    if (user?.email) {
      const docRef = doc(db, 'users', user?.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { name, email, uid, projects } = docSnap.data();

        setUser({ name, email, uid, projects });
        setIsLoggedIn(true);
      }
    }
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={['/', '/project/:projectId']}>
          {loggedIn ? <Workspace /> : <Login />}
        </Route>

        <Route path="/signup" component={SignUp} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
