import { config, passport  } from '@imtbl/sdk';

const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: 'mzn2urjgOdniAVvYneYDC0jgh9lm3kFN',
  redirectUri: 'https://immutable-calculator-app.netlify.app/login',
  logoutRedirectUri: 'https://immutable-calculator-app.netlify.app',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});

export default passportInstance;