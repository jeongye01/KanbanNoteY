import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import React from 'react';

import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact path="/" to="login" />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
