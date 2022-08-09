import Workspace from '../../Layouts/Workspace';
import Project from '../Project';
import { useEffect, useState } from 'react';
import { Bubble } from '../Project/styles';
import { HomeContainer } from './styles';
import { useParams } from 'react-router-dom';

function Home() {
  const [isHome, setIsHome] = useState<boolean>(true);
  const { projectId } = useParams<{ projectId?: string }>();
  useEffect(() => {
    if (projectId) setIsHome(false);
    else setIsHome(true);
  }, [projectId]);
  return (
    <Workspace>
      <button>login</button>
      {isHome ? (
        <HomeContainer>
          <Bubble>
            &larr; <span>프로젝트를 추가하고 일을 시작하세요!👻</span>
          </Bubble>
          <img src={'/images/hi.gif'} />
        </HomeContainer>
      ) : (
        <Project />
      )}
    </Workspace>
  );
}

export default Home;

/*


  ) : (
        <Bubble>
          {-1 > 0 ? <span>&larr;일을 시작하세요!👻</span> : <span>&larr;프로젝트를 추가해 주세요!👻</span>}
        </Bubble>
      )}

      */
