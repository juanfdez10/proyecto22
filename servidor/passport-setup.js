const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //User.findById(id, function(err, user) {
    done(null, user);
  //});
});

passport.use(new GoogleStrategy({
    clientID:"820029364294-n2piaeth6mmuhvcki6l22madalsua1m8.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/google/callback" //cambiar localhost por el prototipo desplegado al final del proyecto
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));

