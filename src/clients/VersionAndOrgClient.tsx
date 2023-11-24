import axios from 'axios';

const VersionAndOrgClient = {
  getApplicationVersion: async () => {
    const { data } = await axios.get('/api/version');
    return data;
  },
  getOrgDeployment: async () => {
    const { data } = await axios.get('/api/org-deployment');
    return data;
  },
};

export default VersionAndOrgClient;
