import express from 'express';
import { loginUser, register } from '../controllers/auth-controller.mjs';


const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', loginUser);

// POST /api/auth/register - User registration
router.post('/register', register);

router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true
  });
  
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Logged out successfully'
  });
});

export default router;