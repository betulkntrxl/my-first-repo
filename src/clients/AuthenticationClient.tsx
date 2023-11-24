import axios from 'axios';

const AuthenticationClient = {
  isAuthenticated: async () => {
    const { data } = await axios.get('/api/auth/isAuthenticated');
    return data;
  },
};

export default AuthenticationClient;
