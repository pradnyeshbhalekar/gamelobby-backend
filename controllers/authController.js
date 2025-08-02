const User = require('../models/user')
const Parlour = require('../models/parlour')
const generateToken = require('../utils/generateToken')

exports.registerUser = async (req,res)=>{
    const {name,email,password,phonenumber} = req.body
    try{
        const userExists = await User.findOne({email})
        if (userExists){
            return res.status(400).json({msg:"User already exists"});
        }
        const user = await User.create({name,email,password,phonenumber})

        return res.status(201).json({
            msg:"Registered Successfully!",
            _id:user._id,
            name:user.name,
            email:user.email,
            token : generateToken(user._id)
        })
    }catch (err){
        console.log('Error occured',err)
        return res.status(500).json({msg:"Registration failed",error:err.message})
    }
}


exports.loginUser = async (req, res) => {
    console.log("Request body:", req.body); 
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide both email and password" });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && await user.matchPassword(password)) {
            return res.status(200).json({
                msg: "Logged in successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ msg: "Login failed", error: err.message });
    }
};


exports.registerParlour = async(req,res)=>{
    const {name,email,password,phonenumber,location} = req.body
    try{
        const parlourExist = await Parlour.findOne({email});
        if (parlourExist){
            return res.status(400).json({
                msg:"Parlour already exists"
            })
        }
        const parlour = await Parlour.create({
            name,email,password,location,phonenumber
        })

        res.status(201).json({
            msg:"Your Parlour has been registered",
            _id:parlour._id,
            name:parlour.name,
            email:parlour.email,
            location:parlour.location,
            phonenumber:parlour.phonenumber,
            token:generateToken(parlour._id)

        })
    }catch(err){
        console.log('Error occured',err)
        return res.status(500).json({msg:"Registration failed",error:err.message})
    }
}

exports.loginParlour = async(req,res) =>{
    const {email,password} = req.body
    try{
        const parlour = await Parlour.findOne({email});
        if(parlour &&(await parlour.matchPassword(password))){
            res.status(200).json({
                msg:"Logged in Successfully",
                _id:parlour._id,
                name:parlour.name,
                email:parlour.email,
                token:generateToken(parlour._id)
            })
        }
    }catch(err){
        console.log('Error occured',err)
        return res.status(500).json({msg:"Registration failed",error:err.message})
    }
}