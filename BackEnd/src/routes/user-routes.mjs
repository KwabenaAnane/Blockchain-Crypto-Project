import express from 'express';
import { addUser, listUsers } from '../controllers/users-controller.mjs';
import { protect, authorize } from '../controllers/auth-controller.mjs';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(listUsers)
  .post(authorize('admin'), addUser); //admin to add users

export default router;