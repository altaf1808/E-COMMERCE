const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

require('../db/conn');
const User = require("../model/userSchema");
const e = require('express');

router.get('/', (req,res) => {
    res.send('Hello World from the server router js');
});

router.post('/register', async (req,res) => {

    const { name , email , phone , work , password , cpassword } = req.body;
   

    if ( !name || !email || !phone || !work || !password || !cpassword ) {
        return res.status(422).json({error : "plz fill the field properly"})
    }

    try {
        const userExist = await User.findOne({email:email});

        if(userExist) {
            return res.status(422).json({error : "Email already Exist"});
        } else if(password != cpassword) {
            return res.status(422).json({error : "Invalid Password"});
        } else {
        
        const user = new User({ name , email , phone , work , password , cpassword});
        await user.save();
        res.status(201).json({ message : "User registered successfully"});
        }

    } catch(err) {
        console.log(err);
    }
});

router.post('/signin', async (req,res) => {
    //console.log(req.body);
    //res.json({ message : "Awesome" });
    try{
        let token;
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error : "Plzz fill the data"});
        }

        const userlogin = await User.findOne({email:email});
        //console.log(userlogin);

        if(userlogin){
            const isMatch = await bcrypt.compare(password,userlogin.password);
            token = await userlogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token , {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });
        if(!isMatch){
            res.status(400).json({error : "Invalid User password"});
        }else {
            res.json({message : "User Signin Successfully"});
        }
        }else {
            res.status(400).json({error : "Invalid Credentials"});
        }
        

    } catch(err) {
        console.log(err);
    }
})

module.exports = router;