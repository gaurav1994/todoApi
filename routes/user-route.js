const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const authMiddleware = require('../utils/auth-middleware')

router.post('/signup' , async (req,res)=>{
     var { username , email, password } = req.body;
     try{
          let userAlready = await User.find({ username : username})
          if(userAlready.length != 0) return res.status(401).json("User already exist try with different username ")
          else{
               let hashedPassword = await bcrypt.hash(password , 10);
               let user = { username : username , email : email , password  : hashedPassword }
               let doc =  await new User(user).save()
               if(doc) return res.status(201).json('Signup Successfully')
               else throw Error('Something went wrong ')
          }
     }catch(err){
          return res.status(501).json( err.message )  
     }
})
router.post('/login' , async  (req,res)=>{
     var username = req.body.username
     var password = req.body.password
          try{
               var user =  await User.findOne( { username : username }).exec()
               if(user){
                    var password = await bcrypt.compare(password, user.password )
                    if(password){
                         var payload = {
                              sub : user._id,
                              username : user.username,
                              email : user.email
                         }
                         var jsontoken = await jwt.sign( payload , process.env.PUBLIC_SECRET, { expiresIn : '50s' } )
                         var refreshToken = await generateRefreshToken(user, payload)
                         res.status(200).json({ message : 'user found', theme : user.theme ,  
                                                            token : 'Bearer '+ jsontoken , refreshToken : refreshToken })
                    }else res.status(401).json({ message : 'incorrect username or password '})
               }else res.status(401).json({message : 'user not found ' }) 
          }catch(err){
               res.status(501).json(err.message)
          }
})
const verifySession = (req,res,next)=>{
     let refreshToken = req.header('Refresh-Token')
     req.refreshToken = refreshtoken;
     User.find({  })
     next()
}
router.post('/auth/create-new-access-token', verifySession ,(req,res)=>{
     res.status(200).json({ message : 'successfully control'})
})

var generateRefreshToken = async (user, payload)=>{
     try{
          if(user.sessions.length == 0){
               let refreshtoken = await jwt.sign(payload , 'randomstring' , { expiresIn : '2h' })
               await user.sessions.push({ token : token })
               await user.save()
               return refreshtoken
          }else{
               let refreshtoken = user.sessions[0].token
               return refreshtoken
          }
     }catch(err){
          console.log(err.message)
     }
}

// update user
router.patch('/update', authMiddleware , async (req,res)=>{
     try{
          let updatedUser = await User.findByIdAndUpdate(req.user._id, req.body , { new : true} )
          if(updatedUser){
               res.status(200).json('updated successfully')
          }else{
               new Error('request not completed')
          }
     }catch(err){
          res.status(501).json(err.message)
     }
})
 
module.exports = router