const { Issuer, generators, custom } = require('openid-client');
require('dotenv').config();

// Set HTTP options for OpenID Connect client
custom.setHttpOptionsDefaults({
  timeout: 15000, // Increase timeout for slower connections
});

let client = null;

async function initializeClient() {
  try {
    // Create the issuer manually instead of using discovery
    const actualIssuer = 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_HKgQyQUi2';
    const domainIssuer = 'https://ap-southeast-1hkgqyqui2.auth.ap-southeast-1.amazoncognito.com';
    
    const issuer = new Issuer({
      issuer: actualIssuer,
      authorization_endpoint: process.env.OIDC_AUTH_URL,
      token_endpoint: process.env.OIDC_TOKEN_URL,
      userinfo_endpoint: `${domainIssuer}/oauth2/userInfo`,
      jwks_uri: `${actualIssuer}/.well-known/jwks.json`,
    });
    
    // Initialize the client
    client = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_CALLBACK_URL],
      response_types: ['code'],
      // Define allowed scopes
      scope: 'email openid phone',
    });
    
    return client;
  } catch (error) {
    console.error('Error initializing OpenID Connect client:', error);
    throw error;
  }
}

function getClient() {
  if (!client) {
    console.error('Client not initialized. Trying to initialize...');
    try {
      // Initialize synchronously as a fallback
      const actualIssuer = 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_HKgQyQUi2';
      const domainIssuer = 'https://ap-southeast-1hkgqyqui2.auth.ap-southeast-1.amazoncognito.com';
      
      const issuer = new Issuer({
        issuer: actualIssuer,
        authorization_endpoint: process.env.OIDC_AUTH_URL,
        token_endpoint: process.env.OIDC_TOKEN_URL,
        userinfo_endpoint: `${domainIssuer}/oauth2/userInfo`,
        jwks_uri: `${actualIssuer}/.well-known/jwks.json`,
      });
      
      client = new issuer.Client({
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET,
        redirect_uris: [process.env.OIDC_CALLBACK_URL],
        response_types: ['code'],
        // Define allowed scopes
        scope: 'email openid phone',
      });
      
    } catch (error) {
      console.error('Emergency initialization failed:', error);
      throw new Error('OpenID Connect client not initialized');
    }
  }
  return client;
}

function generateAuthParams() {
  const nonce = generators.nonce();
  const state = generators.state();
  return { nonce, state };
}

// Helper function to extract path from URL
function getPathFromURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return url; // Return the original string if parsing fails
  }
}

module.exports = {
  initializeClient,
  getClient,
  generateAuthParams,
  getPathFromURL
}; 