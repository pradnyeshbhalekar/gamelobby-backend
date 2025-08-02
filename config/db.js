const mongoose = require('mongoose')

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connect to mongo db")
    }catch(err){
        console.log("error found: ",err)
        process.exit(1);
    }
}

module.exports = connectDb