const {setUpParlour} = require('../controllers/parlourController')
const {protectParlour} = require('../middlewares/authMiddleware')
const express =require('express')
const router = express.Router()

router.patch('/setup/:parlourId',protectParlour,setUpParlour)


module.exports = router;
