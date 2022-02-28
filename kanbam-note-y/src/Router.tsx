import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, user } from './firebase';
import { userState, Iuser } from './atoms';
import { useRecoilState } from 'recoil';
import { db } from './firebase';
import { useHistory } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
function Router() {
  const [loggedIn, setLoggedIn] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    }
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Home /> : <Login />}
        </Route>

        <Route path="/signup" component={SignUp} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
