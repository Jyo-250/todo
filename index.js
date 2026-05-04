const express = require("express");
const jwt = require("jsonwebtoken");
const {authmiddleware} = require("./middleware");
const {todoModel , userModel} = require("./models");
const app = express();

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username: username
    })
    if(existingUser){
        return res.status(403).json({
            message: "User with this username already exists"
        })
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id
    })
})

app.post("/signin", async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username: username,
        password: password
    })
    if(!existingUser){
        return res.status(403).json({
            message: "Incorrect credentials"
        })
    }
    const token = jwt.sign({
        userId: existingUser._id
    }, "Jyothsna123")
    res.json({
        token
    })
})

app.post("/todo",authmiddleware, async(req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const newTodo = await todoModel.create({
        title : title,
        description : description,
        userId : userId
    })
    res.json({
        message : "Todo added!" 
    })
})

app.get("/todos", authmiddleware, async(req,res) =>{
    const userId = req.userId;
    const todos = await todoModel.find({
        userId: userId
    });
    res.json({
        todos
    })
})

app.listen(3000)