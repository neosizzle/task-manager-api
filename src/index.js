const express = require('express')
require('./db/mongoose')//We dont want to grab anything, just wanted to make sure it runs
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express()



// //maintainence mode
// app.use((req,res,next)=>{
//     res.status(503).send("Server under maintainence!")
// })





app.use(express.json())//parse json data into javascript object 
app.use(userRouter)
app.use(taskRouter)

module.exports = app