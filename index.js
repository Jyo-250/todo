const express = require("express");
const jwt = require("jsonwebtoken");
const {authmiddleware} = require("./middleware");
const app = express();

const USERS = [];
const TODOS = [];

let CURRENT_USERID = 1;
let CURRENT_TODOID = 1;

app.use(express.json());

app.post("/signup",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = USERS.find(user => user.username == username);
    if(existingUser){
        return res.status(403).json({
            message: "User with this username already exists"
        })
    }
    USERS.push({
        id: CURRENT_USERID++,
        username,
        password
    })
    res.json({
        id: CURRENT_USERID - 1
    })
})

app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = USERS.find(user => user.username === username && user.password === password);
    if(!existingUser){
        return res.status(403).json({
            message: "Incorrect credentials"
        })
    }
    const token = jwt.sign({
        userId: existingUser.id
    }, "Jyothsna123")
    res.json({
        token
    })
})

app.post("/users",authmiddleware, (req,res)=>{
    const userId = req.userId;
})

app.post("/todo",authmiddleware, (req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    TODOS.push({
        id: CURRENT_TODOID++,
        title : title,
        description : description,
        userId : userId
    })
    res.json({
        message : "Todo added!"
    })
})

app.get("/todos", authmiddleware, (req,res) =>{
    const userId = req.userId;
    const userTodos = TODOS.filter(t => t.userId === userId);
    res.json({
        todos : userTodos
    })
})

app.listen(3000)