const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async (req, res) => {
    try{
        const data = req.body
        const newUser = new User(data)

        const responce = await newUser.save();
        console.log('data saved')

        const payload = {
            id: responce.id
        }

        const token = generateToken(payload);
        console.log("token is:" + token);
        res.status(200).json({responce: responce, token: token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

router.post('/login', async(req, res) => {
    try{
        const {aadharCardNumber, password} = req.body;

        const user = await User.findOne({aadharCardNumber})

        if(!user || !( await user.comparePassword(password))){
            res.status(401).json({error: 'invalis aadharCardNumber 0r password'})
        }

        const payload = {
            id: user.id
        }

        const token = generateToken(payload);

        res.json({token});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }

})

router.put('/profile/password', jwtAuthMiddleware, async (req, res)=>{
    try{
        const userId = req.user; // Extract the id from the request body
        const {currentPassword, newPassword} = req.body; // Updated data for the user
    
        //find the user by user id
        const user = await User.findById(userId)

        //compare current password
        if(!( await user.comparePassword(currentPassword))){
            res.status(401).json({error: 'invalid aadharCardNumber or password'})
        }

        user.password = newPassword;
        await user.save();

        console. log ('password updated') ; 
        res.status(200).json({message: "password updated"});

    }catch(err){
        console. log(err) ;
        res.status (500).json({error: 'Internal Server Error'});
    }    
}) 


module.exports = router;