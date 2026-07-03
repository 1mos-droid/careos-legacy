const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', nurseController.getAllNurses);
router.get('/profile', authMiddleware, nurseController.getNurseProfile);
router.put('/profile', authMiddleware, nurseController.updateNurseProfile);
router.post('/verify', authMiddleware, nurseController.submitVerification);

// Review submission and fetch routing
router.post('/reviews', authMiddleware, reviewController.createReview);
router.get('/:id/reviews', reviewController.getNurseReviews);

router.get('/:id', nurseController.getNurseById);

module.exports = router;
