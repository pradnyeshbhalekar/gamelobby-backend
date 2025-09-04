const Asset = require('../models/asset')
const Game = require('../models/game')
const Parlour = require('../models/parlour')
const axios = require('axios')

const { fetchGameByID } = require('../services/igdbService');


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



exports.addGameToAsset = async (req, res) => {
  try {
    const { assetId } = req.params
    const { igdbGameId } = req.body
    const parlourId = req.parlour._id

    const asset = await Asset.findOne({ _id: assetId, parlour: parlourId })
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found or unauthorized' })
    }


    const igdbGame = await fetchGameByID(igdbGameId)
    if (!igdbGame) {
      return res.status(404).json({ message: 'Game not found in IGDB' })
    }

    let game = await Game.findOne({ igdbId: igdbGame.id })
    if (!game) {
      game = new Game({
        title: igdbGame.name,
        genre: igdbGame.genres?.[0]?.name || 'Unknown',
        multiplayer: igdbGame.multiplayer_modes?.length > 0,
        igdbId: igdbGame.id,
      })
      await game.save()
    }


    if (!asset.games.includes(game._id)) {
      asset.games.push(game._id)
      await asset.save()
    }

    res.status(201).json({
      message: 'Game added to asset',
      game,
    })
  } catch (err) {
    console.error('addGameToAsset error:', err.message)
    res.status(500).json({ message: err.message })
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


exports.editParlourAsset = async(req,res) => {
  try{
    const { assetId } = req.params
    const parlourId = req.parlour._id


    const asset = await Asset.findOne({ _id: assetId, parlour: parlourId })
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found or unauthorized' })
    }

    const {name,device,specs,games,pricing} = req.body

    if (name) asset.name = name
    if (device) asset.device = device
    if (specs) asset.specs = specs
    if (games) asset.games = games
    if (pricing) {
      if (pricing.regular !== undefined) asset.pricing.regular = pricing.regular
      if (pricing.happyHour !== undefined) asset.pricing.happyHour = pricing.happyHour
    }
    await asset.save()

    res.json({
      message:"Asset Updated Successfully",
      asset
    })
  }catch(err){
    console.log("error occurred",err)
    res.status(500).json({ message: "Server error" });
  }
}

exports.getAssetById = async(req,res) => {
  const {id} = req.params
  try{
    const asset = await Asset.findById(id)
    if(!asset) return res.status(404).json({message:"asset not found"})
    res.json({asset})
  }catch(err){
    res.status(500).json({ message: 'Server error' });
    console.log("error message: ",err)
  }
}