import Workspace from '../../Layouts/Workspace';
import Project from '../Project';
import { useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import useUser from '../../utils/useUser';
function Home() {
  /*const { user } = useUser();
  useEffect(() => {
    console.log(user?.email);
  }, [user]);*/
  return (
    <Workspace>
      <Project />
    </Workspace>
  );
}

export default Home;
