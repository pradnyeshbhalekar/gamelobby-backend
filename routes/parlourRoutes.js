const {setUpParlour,toggleParlourStatus,enablePreBooking} = require('../controllers/parlourController')
const {protectParlour} = require('../middlewares/authMiddleware')
const express =require('express')
const router = express.Router()

router.patch('/setup/:parlourId',protectParlour,setUpParlour)
router.put('/:id/status',protectParlour,toggleParlourStatus)
router.put('/:id/prebooking',protectParlour,enablePreBooking)

module.exports = router;
