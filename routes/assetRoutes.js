const express = require('express')
const {addAsset,addGamesToAssets,getParlourAsset}  = require('../controllers/parlourAssetsController')
const {protectParlour} = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/add/asset',protectParlour,addAsset)
router.post('/add/game/:assetId',protectParlour,addGamesToAssets)
router.get('/assets/:parlourId',protectParlour,getParlourAsset)

module.exports = router;