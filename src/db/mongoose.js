const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
    useCreateIndex : true,
    userFindAndModify : false
})





// const task = new Task({
//     description : "Get a degree"
// })

// task.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })