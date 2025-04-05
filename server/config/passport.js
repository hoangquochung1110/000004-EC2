const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
const authConfig = require('./auth');

// User serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configure the OpenID Connect strategy
passport.use(
  new Strategy(
    {
      issuer: authConfig.oidc.issuer,
      authorizationURL: authConfig.oidc.authorizationURL,
      tokenURL: authConfig.oidc.tokenURL,
      clientID: authConfig.oidc.clientID,
      clientSecret: authConfig.oidc.clientSecret,
      callbackURL: authConfig.oidc.callbackURL,
      scope: authConfig.oidc.scope.split(' ')
    },
    (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
      // You can process or transform the profile here
      return done(null, {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        // Add any additional profile information you need
        idToken,
        accessToken,
        refreshToken
      });
    }
  )
);

module.exports = passport; 