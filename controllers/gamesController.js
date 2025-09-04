const Game = require('../models/game')
const Asset = require('../models/asset')

const { getAccessToken, fetchGameFromIGDB,fetchGameByID } = require('../services/igdbService');
const game = require('../models/game');
const asset = require('../models/asset');


exports.searchGame = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Game name is required" });

    const game = await fetchGameFromIGDB(name);
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.json(game);
  } catch (err) {
    console.error("Controller error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.copyGamesFromAsset = async(req,res) => {
    try{
        const {targetAssetId} = req.params;
        const {sourceAssetId} = req.body;
        const parlourId = req.paralour._id

        const [targetAsset,sourceAsset] = await Promise.all([
            Asset.findOne({_id:targetAssetId, parlour:parlourId}),
            Asset.findOne({_id:sourceAssetId,parlour:parlourId})
        ]);

        if (!targetAsset || !sourceAsset){
            return res.status(404).json({message:"one of both asset was not found"})
        }

        const gameToCopy = sourceAsset.games.filter(
            gameId => !targetAsset.games.includes(gameId)
        )

        if (gameToCopy === 0){
            return res.status(200).json({
                message:"no new game to copy",
                copiedCount : 0
            })
        }

        targetAsset.games.push(...gameToCopy)
        await targetAsset.save()

        await targetAsset.populate('games')

        res.status(200).json({
            message:`Successfully copied ${gameToCopy.length} games`,
            copiedCount: gameToCopy.length,
            asset: targetAsset
        })
    }catch(err){
        console.log("Failed to Copy the asset: ",err)
        res.status(500).json({
            message: err.message
        })
    }
}


exports.getAssetsToCopy = async(req,res) => {
    try{
        const {currentAssetId} = req.query;
        const parlourId = req.parlour._id

        const assets = await Asset.find({
            parlour:parlourId,
            _id: {$ne :currentAssetId},
            games:{$exists:true,$not: {$size:0}}
        })
        .populate('games','title')
        .select('name device games')

        const assetsWithCount = asset.map(assets =>({
            _id:asset._id,
            name:asset.name,
            device:asset.device,
            gameCount: asset.games.length,
            gameName: asset.games.slice(0, 3).map(g => g.title)
        }))

        res.status(200).json({assets:assetsWithCount})
    }
    catch (err) {
    console.error('getAssetsForCopy error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

