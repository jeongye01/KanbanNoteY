import Workspace from '../../Layouts/Workspace';
import Project from '../Project';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '../../Atoms/user';
import { Bubble } from './styles';
function Home() {
  console.log('Home');
  const history = useHistory();
  const user = useRecoilValue(userState);
  return (
    <Workspace>
      <Project />
    </Workspace>
  );
}

export default Home;
/*

<span>
    {' '}
    <Bubble>
      <span>&larr;프로젝트를 추가해 주세요!</span>
      <span>👻</span>
    </Bubble>
  </span>

*/
