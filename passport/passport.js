const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var JwtExtractor = require('passport-jwt').ExtractJwt;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user-model');

var jwtOptions = {
     jwtFromRequest : JwtExtractor.fromAuthHeaderAsBearerToken(),
     secretOrKey : process.env.PUBLIC_SECRET || 'sercret_key'
}
var verifyCallbacks = (payload , done)=>{
     User.findOne({ _id : payload.sub } ).exec()
     .then(user=>{
          if(user){
                return done(null, user, { message : "User logged-in"} )
          }
          else {
               return done(null , false )
          }
     })
     .catch(err=>{
          return done(err )
     })
}

passport.use('jwt',  new JwtStrategy( jwtOptions , verifyCallbacks ));
passport.serializeUser(function(user, done) {
     done(null, user);
   });
passport.deserializeUser(function(user, done) {
     done(null, user);
   });
passport.use(new GoogleStrategy({
     clientID : "212794944554-34ft5gj7tku22p24s3p143buifs24utq.apps.googleusercontent.com",
     clientSecret : "g2ratdcwoM0k9Ag_xaTwKHXE",
     callbackURL : "/auth/google/callback"
},
function(accessToken, refreshToken,profile,done){
     user=profile;
     console.log(user)
      return done(null, user, { message : "User logged -in success.."});
}))