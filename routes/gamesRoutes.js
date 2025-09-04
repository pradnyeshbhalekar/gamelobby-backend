const express = require('express');
const router = express.Router();
const { searchGame,getAssetsToCopy,copyGamesFromAsset } = require('../controllers/gamesController');
const {protectParlour} = require('../middlewares/authMiddleware')


router.get('/search', searchGame);
router.post('/asset/:targetAssetId/copy-games',protectParlour,copyGamesFromAsset)
router.get('/assets-for-copy',protectParlour,getAssetsToCopy)


module.exports = router;
