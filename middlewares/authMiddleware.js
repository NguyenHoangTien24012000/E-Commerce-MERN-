const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandle = require('express-async-handler');

const authMiddleware = asyncHandle(async function(req,res, next){
    let token;
    const tokenVerify = req?.headers?.authorization;
    if(tokenVerify.startsWith("Bearer")){
        token = tokenVerify.split(" ")[1];
        try {
            if(token){
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({_id: decode?.id});
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not Authorized token expired, Please login again!")
        }
    }else{
        throw new Error("There is no token attached to header");
    }
})

const isAdmin = asyncHandle(async function(req, res, next){
    if(req?.user.role === "admin"){
        console.log("Admin");
        next();
    }else{
        throw new Error("You are not an admin!");
    }
})

const checkUserBlock = asyncHandle(async function(req, res, next){
    if(req?.user.isBlocked){
        console.log("user was block!!");
        throw new Error("User was block");
    }else{
        console.log("user was block!!");
        next();
    }
})

module.exports = {authMiddleware, isAdmin, checkUserBlock};