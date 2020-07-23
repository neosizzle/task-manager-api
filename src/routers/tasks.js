const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()

//add new tasks endpoint
router.post('/tasks', auth , async (req,res)=>{

    try{
        //const task = new Task(req.body)

        //creating a task with a foreign key
        const task = new Task({
            ...req.body,
            user : req.user._id
        })

        if(!task)res.status(400).send("Bad request!")
        await task.save()
        res.status(201).send(task)

    }catch(e){res.status(500).send()}

    // task.save().then((result)=>{
    //     res.status(201)
    //     res.send('Save success!')
    // }).catch((e)=>{
    //     res.status(400).send('Save Error!' + e)
    // })
        
})

//get all tasks endpoint
//GET /tasks?completed
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt:dasc
router.get('/tasks',auth, async (req,res)=>{
    //set up completed query
    const completed = req.query.completed

    //setup pagination and sort queries
    const sort = {}

    if(req.query.sortBy){//checks if the sortby split is descending or ascending
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }

    try{
        const _id = req.user._id
        if(!completed){
            //find by id with options
            const tasks = await Task.find({user : _id},null,{limit : parseInt(req.query.limit),skip : parseInt(req.query.skip),sort})
            res.send(tasks)
        }

        const tasks = await Task.find({user : _id,completed},null,{limit : parseInt(req.query.limit),skip : parseInt(req.query.skip),sort})

        // //alternative method with populating
        // const tasks = await User.populate('tasks').execPopulate()

        res.send(tasks)
    }catch(e){res.status(500).send() }
    // Task.find({}).then((result)=>{
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
   
})

//get one task endpoint
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id 
    try{
        const task = await Task.findOne({_id , 'user' : req.user._id})
        if(!task) return res.status(404).send('Task not found!')
        res.send(task) 
    }catch(e){res.status(500).send()
    console.log(e)}

    // Task.findById(_id).then((result)=>{
    //     if(!result){
    //         return res.status(404).send('Task not found!')
    //     }
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//update task endpoint
router.patch('/tasks/:id',auth,async (req,res)=>{
    const allowedUpdate = ['completed','description']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update)=> allowedUpdate.includes(update))

    if(!isValidOperation)res.status(400).send("Invalid operation!")

    
    try{

        //find task by id
        const task = await Task.findOne({_id : req.params.id , user : req.user._id})
        if(!task)res.status(404).send("Task not found!")

        //for each of the bodys key, change the value for each task into the keys value
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
        


        // //find by id and update
        // const result = await Task.findByIdAndUpdate(_id,req.body)

        // //if no result, return 404
        // if(!result) res.status(404).send("Task not found")

        // res.send("Update success!\n" + result)
    }catch(e){res.status(500).send()}



})

//delete task endpoint
router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        const deletedTask = await Task.findOneAndDelete({_id : req.params.id, user : req.user._id})
        if(!deletedTask) res.status(404).send("Task not found!")
        res.send("Task deleted!\n" + deletedTask)

    }catch(e){res.status(500).send()}
})

module.exports = router