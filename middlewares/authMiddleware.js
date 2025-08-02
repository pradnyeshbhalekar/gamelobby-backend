const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const Parlour = require('../models/parlour')

const protectUser = asyncHandler(async(req,res,next)=>{
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_TOKEN)

            req.user = await User.findById(decoded.id).select('-password');
            next()
        }catch(err){
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized, no token')
    }
})

const protectParlour = asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_TOKEN)
            req.parlour = await Parlour.findById(decoded.id).select('-password');
            next();
        }catch(err){
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


module.exports = {
    protectParlour,protectUser
}