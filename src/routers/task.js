const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

router.get('/tasks', auth, async (req, res)=>{
    try{
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdatesArray = ["description", "completed"]
    const isValid = updates.every( (key) => allowedUpdatesArray.includes(key) )

    if(!isValid){
        return res.status(400).send({"error": "Invalid updates"})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const user = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router