import { useLocation, useParams } from 'react-router-dom';

const usePath: any = () => {
  const { pathname } = useLocation();
  const params = useParams();

  return Object.entries(params).reduce((path: any, [key, value]) => path.replace(`/${value}`, `/:${key}`), pathname);
};

export default usePath;
