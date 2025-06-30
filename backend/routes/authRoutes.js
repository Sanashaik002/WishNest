const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const {
  signup,
  login,
  resetPassword,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword); // ✅ Make sure this line exists
router.post('/google-login', authController.googleLogin);


module.exports = router;
