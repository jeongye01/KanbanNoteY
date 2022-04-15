import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import useUser from './utils/useUser';
import { doc, getDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { userState, isLoggedIn } from './Atoms/user';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={['/', '/project/:projectId']}>
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/signup" component={SignUp} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;

/*


















*/
