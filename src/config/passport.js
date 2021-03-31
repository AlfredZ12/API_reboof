const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {


  // Match Email's User
  const user = await User.findOne({ email: email });
 
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    //verify status User
    if (user.status != 'Active') {
      console.log("your account is not confirmed");
      return done(null, false, { message: 'your account is not confirmed, please verify your e-mail and confirm your account' });
      // Match Password's User
    } else {
      const match = await user.matchPassword(password);
      console.log(user.password);
      if (match) {
        console.log("your account is confirmed");
        return done(null, user);
      } else {
        console.log("No existe")
        return done(null, false, { message: 'Incorrect Password.' });
      }
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

