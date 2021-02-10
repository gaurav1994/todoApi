const passport = require('passport');

module.exports = (req,res,next)=>{
     passport.authenticate('jwt', {session : false } ,  (err, user, info)=>{
          if(err){
               return res.status(500).json({message  : "Internal server error" ,err : err.message})
          }
          if(!user){
               return res.status(401).json({message : "This route is protected" , 
                         info : info })
          }
          if(user){
               req.user = user
               console.log(req.user)
               next()
               // return res.status(200).json({ message : "login successfully " , user : user , info : info }) 
          }
     })(req,res,next);
     // passport.authenticate('google', {session : false } ,  (err, user, info)=>{
     //      if(err){
     //           return res.status(500).json({message  : "Internal server error" ,err : err.message})
     //      }
     //      if(!user){
     //           return res.status(401).json({message : "This route is protected" , 
     //                     info : info })
     //      }
     //      if(user){
     //           req.user = user
     //           console.log(req.user)
     //           next()
     //           // return res.status(200).json({ message : "login successfully " , user : user , info : info }) 
     //      }
     // })(req,res,next);
}

// module.exports = passport.authenticate('jwt', { session: false })
