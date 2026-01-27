import express from 'express';
import { UserRouter } from './user.js';

export const Router = express.Router();

Router.use('/user', UserRouter);
