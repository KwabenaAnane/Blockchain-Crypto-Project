import express from 'express';
import {
  register,
  loginUser,
  protect,
  authorize
} from '../controllers/auth-controller.mjs';

const router = express.Router();

//  Public Auth Routes
router.post('/register', register);
router.post('/login', loginUser);

//  Authenticated Route: Get current user info
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    message: 'Authenticated user retrieved successfully',
    user: req.user
  });
});

// Role-Based Access Example: Only 'admin' or 'sales' can access
router.get(
  '/secure-data',
  protect,
  authorize('admin', 'sales'),
  (req, res) => {
    res.status(200).json({
      message: 'You are authorized to access this data',
      user: req.user
    });
  }
);

export default router;
