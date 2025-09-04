const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const parlourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    timings:[
      {
        open:{type:String,required:true},
        close:{type:String,required:true}
      }
    ],
    happyhours:{
      start:{type:String},
      end:{type:String},
      discountPercent:{type:Number}
    },
    bookings:[
      {
        type:mongoose.Schema.ObjectId,
        ref:"Booking"
      }
    ],
    assets: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Asset",
      },
    ],
    isOpen : {type: Boolean},
    allowPreBooking:{type: Boolean},
    preBookingDate:{type:Date},

    qrcode: {
      type: String,
    },
  },
  { timestamps: true }
)


parlourSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


parlourSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

const Parlour = mongoose.model("Parlour",parlourSchema)
module.exports = Parlour


