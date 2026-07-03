const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/pending-nurses', adminController.getPendingNurses);
router.patch('/verify-nurse/:id', adminController.verifyNurse);

module.exports = router;
