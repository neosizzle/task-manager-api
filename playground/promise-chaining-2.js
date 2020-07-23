require('../src/db/mongoose')
const Task = require("../src/models/task")

// Task.findByIdAndRemove('5ed8f8a4f7e07110b4f2e2c7').then((result)=>{
//     console.log("Deleted task" + result)
//     return Task.countDocuments({
//         completed : false
//     })
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>console.log(e))

const deleteTaskAndCount = async (id)=>{
    const deletedUser = await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments({completed : false})
    return count
}

deleteTaskAndCount('5ed5e7b7a54091180868d4be').then((c)=>{
    console.log(c)
}).catch((e)=>{
    console.log(e)
})