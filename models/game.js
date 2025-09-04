const mongoose = require('mongoose')


const gameSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    'genre': {
        type:String,
        default:'Unknown'
    },
    'multiplayer':{
        type:Boolean,
        default:false
    },
  igdbId: {
    type: Number,
    unique: true, 
    sparse: true  
  },

  coverUrl: {
    type: String,
    default: null
  },

  releaseDate: {
    type: Date,
    default: null
  },

  platforms: [{
    type: String
  }],

  rating: {
    type: Number, 
    min: 0,
    max: 100
  },

  description: {
    type: String,
    default: ""
  }
}, { timestamps: true });


module.exports = mongoose.model('Game',gameSchema)