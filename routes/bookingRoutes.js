const {createBooking,cancelBooking} = require('../controllers/bookingController')
const express = require('express')
const { protectUser } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/booking/create-booking/:parlourId',protectUser,createBooking)
router.delete('/booking/:bookingId',protectUser,cancelBooking)

module.exports = router;