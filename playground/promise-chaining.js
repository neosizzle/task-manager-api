require('../src/db/mongoose')
const User = require('../src/models/user')


// User.findByIdAndUpdate('5ed8699bc848980f1848e179',{
//     age : 17
// }).then((user)=>{
//     console.log(user)
//     return User.countDocuments({
//         age : 17
//     })
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeAndCount = async (id,age)=>{
    const user = User.findByIdAndUpdate(id,{age})
    const count = User.countDocuments({age})
    return count
}

updateAgeAndCount('5ed5e78e8542aa051cbb4d09', 17).then((result)=>{
    console.log(result)
}).catch((e)=>(
    console.log(e)
))