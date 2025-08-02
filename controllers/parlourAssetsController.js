const Asset = require('../models/asset')
const Game = require('../models/game')
const Parlour = require('../models/parlour')

exports.addAsset = async (req,res) => {
    try{
        const {device,specs,name,pricing} = req.body
        const parlourId = req.parlour._id
    
        if (device === 'PC' && !specs){
            return res.status(400).json({message:"Specs are required for PC Devices"})
        }
    
        const asset = new Asset({
            parlour:parlourId,
            device,
            specs,
            name,
            pricing
        })
    
        await asset.save()
        res.status(201).json({message:"Asset added",asset})

        await Parlour.findByIdAndUpdate(parlourId,{
            $push:{assets:asset._id}
        })

    }catch(error){
    res.status(500).json({ message: error.message });
    }
}

exports.addGamesToAssets = async(req,res) => {
    try{
        const {assetId} = req.params;
        const {title,genre,multiplayer} = req.body
        const parlourId = req.parlour._id

        const asset = await Asset.findOne({_id:assetId,parlour:parlourId})
        if(!asset){
            return res.status(404).json({message:"Asset not found or unauthorized"})
        }

        const game = new Game({
            title,
            genre,
            multiplayer
        })

        await game.save()

        asset.games.push(game._id)
        await asset.save()

        res.status(201).json({
            message:"Game added to asset: ",game
        })
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getParlourAsset = async(req,res) => {
    try{
        const parlourId = req.parlour._id
        const assets = await Asset.find({parlour:parlourId}).populate('games')
        
        res.status(200).json({assets})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

