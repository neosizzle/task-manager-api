const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const Email = require('../emails/accounts')
const router = new express.Router()


//add new users endpoint
router.post('/users', async (req,res)=>{
    
    const user = new User(
        req.body
    )
    
    try{
        Email.sendWelcomeEmail(user.name , user.email)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(error){
        res.status(400).send('Save Error!' + error)
    }

    // user.save().then((result)=>{
    //     res.status(201)
    //     res.send("Save success!")
    // }).catch((error)=>{
    //     res.status(400).send('Save Error!' + error)
    // })
})

//user login endpoint
router.post('/users/login', async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    if(!email || !password) res.status(401).send("Bad request!")

    try{
        const user = await User.findByCredentials(email,password)
        if(!user) res.status(401).send("Unable to login!")

        
        const token = await user.generateAuthToken()
        res.send({user,token})



    }
    catch(e){res.status(404).send(e)}
})

//user logout endpoint  
router.post('/users/logout', auth , async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })

        await req.user.save()

        res.send()
    }catch(e){res.status(500).send({e})}
})

//user logoutall endpoint
router.post('/users/logoutAll', auth , async(req,res)=>{
    try{
        req.user.tokens = []


        await req.user.save()

        res.send()
    }catch(e){res.status(500).send({e})}
})

//user avatar upload endpoint
const upload = multer({//initalize avatar upload
    limits : {
        filesize : 2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){//checks if the postfix of the filename is an image file
           return cb(new Error("Please upload an image file!"))
        }

        return cb(undefined,true)
    }
})
router.post("/users/me/avatar",auth, upload.single('avatar'),async (req,res)=>{
        const buffer = await sharp(req.file.buffer).resize({
            width : 250,
            height : 250
        }).png().toBuffer()

        req.user.avatar = buffer
        await req.user.save()
        res.send()
    
},(error,req,res,next)=>{//error handling for multer so wqe can customize the output
    res.status(400).send({error:error.message})
})

//delete user avatar endpoint
router.delete("/users/me/avatar",auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()

},(error,req,res,next)=>{//error handling for multer so wqe can customize the output
res.status(400).send({error:error.message})
})

//get user avatar endpoint
router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar)throw new Error

        res.set('Content-Type','image/png')//sets the resposne header to receive an image file 
        res.send(user.avatar)
    }catch(e){res.status(500).send("OOF")}

})

//get user endpoint
router.get('/users/me',auth, async (req,res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }

    // User.find({}).then((result)=>{
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
   
})

//update user endpoint 
router.patch('/users/me',auth, async(req,res)=>{
    const allowedUpdate = ['name','email','age','password']//to set updatable elements for the user
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update)=> allowedUpdate.includes(update))
    if(!isValidOperation) res.status(400).send("Invalid operation!")


    try{
        // //find user by id
        // const user = await User.findById(req.user._id)

        //for each of the bodys key, change the value for each user into the kys value
        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()
        
        res.send(req.user)
        
        // const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})//new returns the new update, runValidators run the model validators when updating
        // if(!user) res.status(404).send("User dont exist")
        // res.send('Update Sucess!\n' + user)

    }catch(e){res.status(500).send(e)}
    
})

//delete user endpoint
router.delete('/users/me', auth , async (req,res)=>{
    
   try{
    Email.sendCancelEmail(req.user.name , req.user.email)
    await req.user.remove()
    res.send(req.user)
   }catch(e){
       res.status(500).send()
   }

   
})



module.exports = router