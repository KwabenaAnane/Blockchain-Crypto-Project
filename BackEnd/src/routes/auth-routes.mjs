import express from 'express';
import { loginUser, register } from '../controllers/auth-controller.mjs';
import User from '../models/schemas/UserModel.mjs';

const router = express.Router();

router.post('/login', loginUser);

router.post('/register', register);

router.post('/store-token', async (req, res) => {
  const { token, user } = req.body;
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    existingUser.token = token;
    await existingUser.save();
    res.send({ message: 'Token stored successfully' });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

router.post('/logout', async (req, res) => {
  const id = req.body.id;
  const user = await User.findById(id);
  if (user) {
    user.token = null;
    await user.save();
  }
  res.clearCookie('jwt');
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Logged out successfully',
  });
});

export default router;
