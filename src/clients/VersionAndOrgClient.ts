import axios from 'axios';

const VersionAndOrgClient = {
  getApplicationVersion: async () => axios.get('/api/version'),
  getOrgDeployment: async () => axios.get('/api/org-deployment'),
};

export default VersionAndOrgClient;
