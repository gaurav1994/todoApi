//  -------------------------------------------imports all npm library -------------------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const passport = require('passport');

const listRoute = require('./routes/list-route')
const taskRoute = require('./routes/task-route')
const userRoute = require('./routes/user-route')

require('./passport/passport')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
 
app.use(passport.initialize())

require("./utils/mongoose-connection");


app.use('/lists', listRoute)
app.use('/tasks', taskRoute)
app.use('/users', userRoute)

var PORT = process.env.PORT_NUMBER || 3000;
app.listen(PORT, ()=>{
     console.log("Express Server is running on port : " + PORT);
})
