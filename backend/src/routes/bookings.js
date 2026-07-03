const express = require('express');
const router = express.Router();
const { z } = require('zod');
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(authMiddleware);

const createBookingSchema = z.object({
  body: z.object({
    nurse_id: z.number().int().positive(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    hours_per_day: z.number().int().min(1).max(24)
  })
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  }),
  body: z.object({
    status: z.enum(['approved', 'cancelled', 'completed'])
  })
});

router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.patch('/:id', validate(updateStatusSchema), bookingController.updateBookingStatus);

module.exports = router;
