const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var JwtExtractor = require('passport-jwt').ExtractJwt;

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
