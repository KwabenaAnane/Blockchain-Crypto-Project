import jwt from 'jsonwebtoken';
import User from '../models/schemas/UserModel.mjs';
import AppError from '../utilities/appError.mjs';
import catchErrorAsync from '../utilities/catchErrorAsync.mjs';

//  Create a token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// 🔓 Register new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const newUser = await User.create({ firstName, lastName, email, password, role });
    const token = createToken(newUser);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

//  Login user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  const token = createToken(user);

  res.cookie('jwt', token, {
    expiresIn: new Date(Date.now() * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
  });

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { token: token } });
};


const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

//  Protect route middleware
export const protect = catchErrorAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Du måste vara inloggad för att nå resursen', 401)
    );
  }

  const decoded = await verifyToken(token);

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return next(new AppError('Användaren existerar inte längre', 401));
  }

  req.user = user;

  next();
});

// Role-based access
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };
};
