const getVersion = (req, res) => {
  const VERSION = process.env.VERSION || 'local-dev';
  res.send(`{"version": "${VERSION}"}`);
};

const getOrgDeployment = (req, res) => {
  const ORG_DEPLOYMENT = process.env.ORG_DEPLOYMENT || 'mckesson';
  res.send(`{"orgDeployment": "${ORG_DEPLOYMENT}"}`);
};

export { getVersion, getOrgDeployment };
