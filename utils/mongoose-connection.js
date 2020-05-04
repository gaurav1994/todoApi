const mongoose = require('mongoose');

mongoose.connect(process.env.DB_STRING, 
     {useNewUrlParser : true, 
     useUnifiedTopology : true,
     useFindAndModify : true}).then(()=>{
          console.log("Database connected successfully   : db-todo")
     }).catch(error=>{
          console.log("Something went wrong to connect with DATABASE (db-todo)...")
          console.log(error)
     })
     global.Promise == mongoose.Promise;