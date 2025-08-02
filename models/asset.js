const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
    parlour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parlour',
    required: true
  },
    device : {
    type: String,
    enum:['PC','PS5','PS4','XBOX','Racing Sim','VR'],
    required: true,
  },
    specs:{
        type:String,
        required:function(){
            return this.device === 'PC'
        }
    },
  name:{
    type:String,
    required:true
  },
  games:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Game'
  }],
  pricing:{
    regular:{type:Number,required:true},
    happyHour:{type:Number}
  }
})

module.exports = mongoose.model('Asset',assetSchema)