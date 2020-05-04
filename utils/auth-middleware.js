const passport = require('passport');
module.exports = (req,res,next)=>{
     passport.authenticate('jwt', {session : false } ,  (err, user, info)=>{
          if(err){
               return res.status(500).json({message  : "Internal server error" ,err : err.message})
          }
          if(!user){
               redirectRoute = "";
               return res.status(401).json({message : "This route is protected" , 
                         info : info , redirectRoute : redirectRoute })
          }
          if(user){
               req.user = user
               console.log(req.user)
               next()
               // return res.status(200).json({ message : "login successfully " , user : user , info : info }) 
          }
     })(req,res,next);
}

// module.exports = passport.authenticate('jwt', { session: false })