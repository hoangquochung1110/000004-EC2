// Load environment variables first
require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// static files
app.use(express.static('public'));

// Templeting engines
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    // Add helper for checking if user is authenticated
    isAuthenticated: function(req) {
      return req.session && req.session.isAuthenticated;
    },
    // Add helper for getting current user
    currentUser: function(req) {
      return req.session && req.session.isAuthenticated ? req.session.userInfo : null;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Make auth middleware available to templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session && req.session.isAuthenticated;
  res.locals.user = req.session && req.session.isAuthenticated ? req.session.userInfo : null;
  next();
});

// Authentication middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/auth/login');
};

// Routes
const userRoutes = require('./server/routes/user');
const authRoutes = require('./server/routes/auth');

// Auth routes (public)
app.use('/auth', authRoutes);

// User routes (protected)
app.use('/', ensureAuthenticated, userRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));