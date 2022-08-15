//npm install express mogoose ejs dotenv
//npm install nodemon --save-dev
//"start": "nodemon server.js"

//Declare variables
const { urlencoded } = require('express')
const express = require('express')
const app = express()
const PORT = 8500
const mongoose = require('mongoose')
//const todotask = require('./models/todotask')
require('dotenv').config()
const ToDoTask = require('./models/todotask')

//set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(urlencoded({extended:true})) //allows us to pass through data such as arrays

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true}, //allows us to pass through expected data like text
    () => {console.log('Connected to db!')}
)
  
//Get method to render root file aka home page
app.get('/', async (request,response) => {
    try{
        ToDoTask.find({}, (err,tasks)=> {
            response.render('index.ejs', {todoTasks: tasks})
        })
    } catch (err) {
        if(err) return response.status(500).send(err)
    }
})

//POST AKA Create into the database
app.post('/', async(request,response) => {
    const todoTask = new ToDoTask(
    {
        title: request.body.title,
        content: request.body.content
    }

)
    try{
        await todoTask.save()
        console.log(todoTask)
        response.redirect('/')
    } catch (err) {
        if(err){
            return response.status(500).send(err)
        } 
        response.redirect('/')  
    }
})

//PUT METHOD or Update which allows us to edit
app
    .route('/edit/:id')
    .get((request,response) => {
        const id = request.params.id
        ToDoTask.find({}, (err,tasks) => {
            response.render('edit.ejs', {
                todoTasks: tasks, 
                idTask: id
            })
        })
    })
        .post((request,response) => {
            const id = request.params.id
            ToDoTask.findByIdAndUpdate(
                id,
                {
                    title: request.body.title,
                    content: request.body.content
                },
                err => {
                    if(err) return response.status(500).send(err)
                    response.redirect('/')
                }
            )
        })

app
    .route('/remove/:id')
    .get((request,response) => {
        const id = request.params.id
        ToDoTask.findByIdAndRemove(id,
              err => {
             if(err){
                return response.send(500, err)
             } 
            response.redirect('/')
        })
    })


app.listen(PORT, () => {
    console.log("Server is running on selected Port!")
})