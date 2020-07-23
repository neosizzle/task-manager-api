const mongoose = require('mongoose')

//task schema
const taskSchema = mongoose.Schema({
    description:{
        type : String,
        required : true
    },
    completed : {
        type : Boolean,
        default : false
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{timestamps : true})

//task model
const Task = mongoose.model("Task",taskSchema)

module.exports = Task