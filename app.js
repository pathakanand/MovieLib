const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const User = require('./model/User');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/movie-Library')
  .then(() => console.log('Connected!'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No user with that email' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password incorrect' });
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  }).catch(err => {
    done(err, null);
  });
});

app.use('/', authRoutes);
app.use('/', movieRoutes);  
app.use('/', listRoutes);

app.listen(8080, () => console.log(`Server running on port 8080`));
