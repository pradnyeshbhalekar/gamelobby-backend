const express = require('express')
const {addAsset,getParlourAsset,searchGame,addGameToAsset,editParlourAsset,getAssetById}  = require('../controllers/parlourAssetsController')
const {protectParlour} = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/asset',protectParlour,addAsset)

router.get('/assets/:parlourId',protectParlour,getParlourAsset)

router.post('/asset/:assetId/game', protectParlour, addGameToAsset);

router.put('/asset/:assetId',protectParlour,editParlourAsset)

router.get('/asset/:assetId',protectParlour,getAssetById)

module.exports = router;  


