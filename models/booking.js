const mongoose=require('mongoose')

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    parlour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Parlour',
        required:true
    },
    asset:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Asset',
        required:true
    },
    game:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Game',
        required:true
    },
    bookingTime:{
        type:Date,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    totalTime:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String
    },
    qrCode:{
        type:String
    },
    
},{timestamps:true})

module.exports = mongoose.model('Booking',bookingSchema)