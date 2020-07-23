const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//user scheme
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true

    },
    email : {
        type : String,
        unique : true,
        required: true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email address is not valid')
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validator(value){
            if(value < 0) throw new Error('age cant be negative')
            
            
        }

    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if(value.length < 6) throw new Error('Password must be logner than 6 characters!')
            if(value.toLowerCase() == 'password')throw new Error('Not literally!')
        }


    },

    avatar : {
        type : Buffer
    },

    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
},{timestamps : true}
)

//establish a relationship with task model as virtual property
userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : "user"
})


//set schema methods
//hashes passowrd
userSchema.pre('save', async function(next){//normal function used because .pre() is a methid that needs the this bind
    const user = this
    if(user.isModified('password')) user.password = await bcrypt.hash(user.password,8)
    next()
})

//deletes tasks when user is deleted
userSchema.pre('delete' , async function(next){
    const user = this
    await Task.deleteMany({user : user._id})

    next()
})


//find by credentials
userSchema.statics.findByCredentials = async(email,password)=>{//create your own methods accesible on models
    const user = await User.findOne({email})
    if(!user) throw new Error('User dosnt exist!')


    if(!await bcrypt.compare(password,user.password)) throw new Error("Unable to login!")

    return user

}


//generate token
userSchema.methods.generateAuthToken = async function(){//creating your own methods accesible on instances
    const user = this
    const token = jwt.sign({_id : user.id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}


//get user profile data w/o passwords and tokens
userSchema.methods.toJSON = function(){
    const user = this

    userData = user.toObject()//returns a bland js object without mongoose methods/metadata
   
    delete userData.password
    delete userData.tokens
    delete userData.avatar

    return userData
    
}


//user model
const User = mongoose.model("User",userSchema)

module.exports = User