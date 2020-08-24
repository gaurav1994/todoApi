const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
     username : { type : String, required : true},
     email : { type : String , required : true },
     password : { type : String , required : true },
     theme : { type : String , default : 'light' },
     sessions : [
          {
               token : { type : String }
          }
     ]
})

userSchema.methods.createSessions = () =>{
     
}

module.exports = mongoose.model('User', userSchema, 'users');