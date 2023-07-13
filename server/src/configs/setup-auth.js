import msal from '@azure/msal-node';
import { MSAL_CONFIG, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from './auth-config.js';
import { logger } from './logger.js';

const msalInstance = new msal.ConfidentialClientApplication(MSAL_CONFIG);
const cryptoProvider = new msal.CryptoProvider();

export const setupAuth = expressWebServer => {
  logger.info('Setting up Auth...');

  async function redirectToAuthCodeUrl(
    req,
    res,
    next,
    authCodeUrlRequestParams,
    authCodeRequestParams
  ) {
    // Generate PKCE Codes before starting the authorization flow
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

    // Set generated PKCE codes and method as session vars
    req.session.pkceCodes = {
      challengeMethod: 'S256',
      verifier,
      challenge,
    };

    req.session.authCodeUrlRequest = {
      redirectUri: REDIRECT_URI,
      responseMode: 'form_post',
      codeChallenge: req.session.pkceCodes.challenge,
      codeChallengeMethod: req.session.pkceCodes.challengeMethod,
      ...authCodeUrlRequestParams,
    };

    req.session.authCodeRequest = {
      redirectUri: REDIRECT_URI,
      code: '',
      ...authCodeRequestParams,
    };

    // Get url to sign user in and consent to scopes needed for application
    try {
      const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
      res.redirect(authCodeUrlResponse);
    } catch (error) {
      next(error);
    }
  }

  expressWebServer.get('/api/auth/login', async (req, res, next) => {
    // create a GUID for crsf
    req.session.csrfToken = cryptoProvider.createNewGuid();

    const state = cryptoProvider.base64Encode(
      JSON.stringify({
        csrfToken: req.session.csrfToken,
        redirectTo: '/',
      })
    );

    const authCodeUrlRequestParams = {
      state,
      scopes: ['openid', 'offline_access', 'profile', 'email'],
    };

    const authCodeRequestParams = {
      scopes: ['openid', 'offline_access', 'profile', 'email'],
    };

    // trigger the first leg of auth code flow
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams);
  });

  expressWebServer.post('/api/auth/redirect', async (req, res, next) => {
    if (req.body.state) {
      const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));

      // check if csrfToken matches
      logger.debug(`state.csrfToken ${state.csrfToken}`);
      logger.debug(`req.session.csrfToken ${req.session.csrfToken}`);

      if (state.csrfToken === req.session.csrfToken) {
        req.session.authCodeRequest.code = req.body.code; // authZ code
        req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier; // PKCE Code Verifier

        try {
          const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
          req.session.accessToken = tokenResponse.accessToken;
          req.session.idToken = tokenResponse.idToken;
          req.session.account = tokenResponse.account;
          req.session.isAuthenticated = true;

          res.redirect(state.redirectTo);
        } catch (error) {
          next(error);
        }
      } else {
        logger.info(
          `CSRF token doesn't match, destroying session and redirecting them to login again`
        );
        req.session.destroy(
          () => res.redirect('/api/auth/login') // redirect to login route
        );
      }
    } else {
      next(new Error('state is missing'));
    }
  });

  expressWebServer.get('/api/auth/logout', (req, res) => {
    const logoutUri = `${MSAL_CONFIG.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

    req.session.destroy(() => {
      res.redirect(logoutUri);
    });
  });

  logger.info('Auth Setup Complete');
};
