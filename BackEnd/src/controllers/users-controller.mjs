import User from '../models/schemas/UserModel.mjs';
import { catchErrorAsync } from '../utilities/catchErrorAsync.mjs';

// Add a new user
export const addUser = catchErrorAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  user.password = undefined;

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: { user },
  });
});

// List all users
export const listUsers = catchErrorAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { users },
  });
});


