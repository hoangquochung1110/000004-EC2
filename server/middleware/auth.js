// Authentication middleware
module.exports = {
  // Ensure user is authenticated
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // Redirect to login page if not authenticated
    res.redirect('/auth/login');
  },

  // Check if user is authenticated (for views)
  isAuthenticated: (req) => {
    return req.isAuthenticated();
  },

  // Get the current user if authenticated
  currentUser: (req) => {
    return req.isAuthenticated() ? req.user : null;
  }
}; 