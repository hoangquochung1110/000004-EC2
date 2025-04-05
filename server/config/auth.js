// Load environment variables
require('dotenv').config();

// OpenID Connect configuration
module.exports = {
  oidc: {
    // These values would typically come from environment variables
    issuer: process.env.OIDC_ISSUER || 'https://your-identity-provider.com',
    authorizationURL: process.env.OIDC_AUTH_URL || 'https://your-identity-provider.com/oauth2/authorize',
    tokenURL: process.env.OIDC_TOKEN_URL || 'https://your-identity-provider.com/oauth2/token',
    clientID: process.env.OIDC_CLIENT_ID || 'your-client-id',
    clientSecret: process.env.OIDC_CLIENT_SECRET || 'your-client-secret',
    callbackURL: process.env.OIDC_CALLBACK_URL || 'http://localhost:5000/auth/callback',
    scope: 'openid phone email'
  }
}; 