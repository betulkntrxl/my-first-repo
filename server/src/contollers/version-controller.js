const getVersion = (req, res) => {
  const VERSION = process.env.VERSION || 'local-dev';
  res.send(`{"version": "${VERSION}"}`);
};

export { getVersion };
