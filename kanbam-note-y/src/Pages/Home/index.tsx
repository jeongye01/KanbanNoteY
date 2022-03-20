import Workspace from '../../Layouts/Workspace';
import Project from '../Project';
function Home() {
  console.log('Home');
  return (
    <Workspace>
      <Project />
    </Workspace>
  );
}

export default Home;
