import { logger } from '../configs/logger-config.js';

const GPT_3_5_TURBO_16K = 'GPT-3-5-Turbo-16K';
const GPT_4_32K = 'GPT-4-32K';

// AD Groups in NMACK that were created for GPT4 authorization are:
// mt-mckesson-chatapp-gpt4-dev
// mt-mckesson-chatapp-gpt4-uat
// mt-mckesson-chatapp-gpt4-prod
const GPT4_AUTHORIZATION_GROUP = `mt-mckesson-chatapp-gpt4-${process.env.DEPLOY_STAGE}`;

/* eslint-disable */
const checkIfUserIsAuthorizedForGPT4 = (req, res, next) => {
  logger.info(`Checking if user is authorized for GPT4...`);

  const chatAppGroupsUserIsAMemberOf = req.userContext.userinfo.ChatApp_groups;

  if (
    process.env.ORG_DEPLOYMENT === 'uson' ||
    !chatAppGroupsUserIsAMemberOf.includes(GPT4_AUTHORIZATION_GROUP)
  ) {
    logger.info(`User is not authorized to use GPT4`);
    return res.status(403).send('User is not authorized to use GPT4');
  }

  logger.info(`User is authorized to use GPT4`);

  next();
};
/* eslint-enable */

const getAvailableModels = (req, res, next) => {
  logger.info(`Getting available models...`);
  const models = [GPT_3_5_TURBO_16K];

  // OKTA Custom Claims to retrieve what ChatApp groups the user
  // is a member of is only configured for McKesson Okta
  // These custom claims will populate any group the user is a member
  // of if the group starts with 'mt-mckesson-chatapp'
  if (process.env.ORG_DEPLOYMENT === 'mckesson') {
    const chatAppGroupsUserIsAMemberOf = req.userContext.userinfo.ChatApp_groups;
    logger.debug(
      `OKTA Custom Claim ChatApp_groups ${JSON.stringify(chatAppGroupsUserIsAMemberOf, null, 2)}`,
    );

    if (
      chatAppGroupsUserIsAMemberOf &&
      chatAppGroupsUserIsAMemberOf.includes(GPT4_AUTHORIZATION_GROUP)
    ) {
      logger.info(`User has GPT4 access`);
      models.push(GPT_4_32K);
    }
  } else {
    logger.debug(
      `OKTA Custom Claim ChatApp_groups not available for org deployment ${process.env.ORG_DEPLOYMENT}`,
    );
  }

  logger.debug(`availableModels ${JSON.stringify(models, null, 2)}`);

  res.send(`{"availableModels": ${JSON.stringify(models)}}`);
};

const addPromptHeaders = (req, res, next) => {
  logger.info(`Adding required and optional headers to http request to Mulesoft...`);

  // Adding headers for Mulesoft API
  req.headers.client_id = process.env.MULESOFT_OPENAI_CLIENT_ID;
  req.headers.client_secret = process.env.MULESOFT_OPENAI_CLIENT_SECRET;
  if (process.env.ALLOW_TEST_USER === 'true' && req.header('TEST_USER_API_KEY')) {
    logger.info('using fake email for test user');
    req.headers.urn = 'test-user@mckesson.com';
    req.headers.bu = 'McKesson Corporate';
  } else {
    req.headers.urn =
      req.userContext.userinfo.email ||
      req.userContext.userinfo.preferred_username ||
      'Not Available';
    if (process.env.ORG_DEPLOYMENT === 'uson') {
      req.headers.bu = 'US Oncology';
    } else {
      req.headers.bu = req.userContext.userinfo.company || 'Not Available';
    }
  }

  next();
};

export { checkIfUserIsAuthorizedForGPT4, getAvailableModels, addPromptHeaders };
