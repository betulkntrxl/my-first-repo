import axios from 'axios';

const AuthenticationClient = {
  isAuthenticated: async () => axios.get('/api/auth/isAuthenticated'),
};

export default AuthenticationClient;
