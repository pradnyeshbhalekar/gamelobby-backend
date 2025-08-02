const express = require('express')
const {
    registerParlour,
    loginParlour,
    registerUser,
    loginUser
} = require('../controllers/authController')

const router = express.Router()

router.post('/user/register',registerUser)
router.post('/user/login',loginUser)

router.post('/parlour/register',registerParlour)
router.post('/parlour/login',loginParlour)

module.exports = router;