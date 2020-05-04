const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const authMiddleware = require('../utils/auth-middleware');

router.post('/signup' , async (req,res)=>{
     var { username , email, password } = req.body;
     try{
     let hashedPassword = await bcrypt.hash(password , 10);
     let user = { username : username , email : email , password  : hashedPassword }
     let doc =  await new User(user).save()
     if(doc) return res.status(201).json(doc)
     else throw Error('Something went wrong ')
     }catch(err){
          return res.status(501).json( err.message )  
     }
})
router.post('/login' , async  (req,res)=>{
     var username = req.body.username
     var password = req.body.password
     if(username != undefined && password != undefined ){
          try{
               var user =  await User.findOne( { username : username }).exec()
               if(user){
                    var password = await bcrypt.compare(password, user.password )
                    if(password){
                         console.log('user found ')
                         var payload = {
                              sub : user._id,
                              username : user.username,
                              email : user.email
                         }
                         let userRes = {
                              _id : user._id,
                              username : user.username,
                              email : user.email
                         }
                         var jsontoken = await jwt.sign( payload , process.env.PUBLIC_SECRET, { expiresIn : '1h' } )
                         res.status(200).json({ message : 'user found' ,  token : 'Bearer '+ jsontoken })
                    }else res.status(401).json({ message : 'incorrect username or password '})
               }else res.status(401).json({message : 'user not found ' }) 
          }catch(err){
               res.status(501).json(err.message)
          }
     } else res.status(400).json({message : 'bad request'})
})
router.get('/dash',  authMiddleware ,(req,res)=>{
     console.log(req.user)
     console.log(req.user)
     res.status(200).json('route completlty protected ! welcome to admin')
     
})
 
module.exports = router