const express = require("express")
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.post('/tasks', (req, res)=>{
    const task = new Task(req.body)
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/users', (req, res)=>{
    User.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.get('/users/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
}) 

app.patch('/users/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdatesArray = ["name", 'email', "password", "age"]
    // const isValid = updates.every((key)=>{
    //     return allowedUpdatesArray.includes(key)
    // })
    const isValid = updates.every( (key) => allowedUpdatesArray.includes(key) )
    if(!isValid){
        return res.status(400).send({"error": "Invalid updates"})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

app.get('/tasks', (req, res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req, res)=>{
    const _id = req.params.id
    Task.findById(_id).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

app.patch('/tasks/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdatesArray = ["description", "completed"]
    const isValid = updates.every( (key) => allowedUpdatesArray.includes(key) )
    if(!isValid){
        return res.status(400).send({"error": "Invalid updates"})
    }
    try{
        const user = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/tasks/:id', async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

app.listen(port, ()=>{
    console.log("Server is on port", port)
})