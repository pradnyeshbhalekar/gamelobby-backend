const mongoose = require('mongoose')


const gameSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    'genre': String,
    'multiplayer':Boolean
})

module.exports = mongoose.model('Game',gameSchema)