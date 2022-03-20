import EachProject from '../EachProject';
import { useRecoilValue } from 'recoil';
import { userState } from '../../Atoms/user';

function ProjectList() {
  console.log('ProjectList');
  const user = useRecoilValue(userState);

  return (
    <>
      <div>
        {user?.projects.map((project) => (
          <EachProject key={project.id} projectId={project.id} projectName={project.name} />
        ))}
      </div>
    </>
  );
}

export default ProjectList;
