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
import { userState } from './atoms';
function Router() {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const setUser = useSetRecoilState(userState);
  onAuthStateChanged(auth, async (user) => {
    if (user?.email) {
      const docRef = doc(db, 'users', user?.email);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      if (docSnap.exists()) {
        console.log(docSnap.data());
        const { name, email, uid } = docSnap.data();
        console.log(name, email, uid);
        setUser({ name, email, uid });
        setLoggedIn(true);
      }
    }
  });
  console.log(loggedIn);

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
