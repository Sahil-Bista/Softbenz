import express from 'express';
import { registerUser } from '../../controller/registerController.js';
import { loginUser } from '../../controller/authController.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import {
  loginValidator,
  registerValidator,
} from '../../validation/userValidation.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const UserRouter = express.Router();

UserRouter.post(
  '/register',
  registerValidator,
  validationMiddleware,
  asyncWrapper(registerUser),
);
UserRouter.post(
  '/login',
  loginValidator,
  validationMiddleware,
  asyncWrapper(loginUser),
);
