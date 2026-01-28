import express from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { verifyRoles } from '../../middlewares/verifyRoles.js';
import {
  createBlog,
  getAllAuthorBlogs,
  getBlog,
  postBlog,
} from '../../controller/blogController.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import {
  createBlogValidator,
  validateSlug,
} from '../../validation/blogValidation.js';

export const BlogRouter = express.Router();

BlogRouter.post(
  '/create',
  verifyJWT,
  verifyRoles(['Author']),
  createBlogValidator,
  validationMiddleware,
  asyncWrapper(createBlog),
);

BlogRouter.post(
  '/publish/:slug',
  verifyJWT,
  verifyRoles(['Author']),
  validateSlug,
  validationMiddleware,
  asyncWrapper(postBlog),
);

BlogRouter.get(
  '/:slug',
  verifyJWT,
  verifyRoles(['Author']),
  validateSlug,
  validationMiddleware,
  asyncWrapper(getBlog),
);

BlogRouter.get(
  '/',
  verifyJWT,
  verifyRoles(['Author']),
  asyncWrapper(getAllAuthorBlogs),
);
