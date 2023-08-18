import { useNavigate } from 'react-router-dom';

const RedirectTo = (url: string) => {
  const navigate = useNavigate();
  navigate(url);
};

export default RedirectTo;
