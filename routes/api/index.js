import express from 'express';
import { UserRouter } from './user.js';
import { BlogRouter } from './blog.js';

export const Router = express.Router();

Router.use('/user', UserRouter);
Router.use('/blog', BlogRouter);
