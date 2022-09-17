const dotenv = require(`dotenv`);
const express = require('express');
const mongoose = require('mongoose');
const app = express();

dotenv.config({path:'./config.env'});
require('./db/conn');
//const User = require('./model/userSchema');

app.use(express.json());
app.use(require('./router/auth'));

const DB = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose.connect(DB).then(() => { 
    console.log('Connection successful');
}).catch((err) => console.log(err));


const middleware = (req,res,next) => {
    console.log('Hello My Middleware');
}

//middleware();

app.get('/', (req,res) => {
    res.send('Hello World from the server');
});

app.get('/about', middleware, (req,res) => {
    console.log('Hello My About');
    res.send('Hello About World from the server');
});

app.get('/contact', (req,res) => {
    res.send('Hello contact World from the server');
});

app.get('/signin', (req,res) => {
    res.send('Hello signin World from the server');
});

app.get('/signup', (req,res) => {
    res.send('Hello signup World from the server');
});

app.listen(PORT,() => {
    console.log(`server is running at port ${PORT}`);
})
