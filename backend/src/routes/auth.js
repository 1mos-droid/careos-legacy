const express = require('express');
const router = express.Router();
const { z } = require('zod');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'nurse', 'doctor', 'family', 'admin'], {
      errorMap: () => ({ message: 'Role must be a valid registration type.' })
    }),
    phone: z.string().optional(),
    location: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

router.post('/signup', validate(signupSchema), authController.register);
router.post('/register', validate(signupSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
