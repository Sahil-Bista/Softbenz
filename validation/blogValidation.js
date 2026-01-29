import { body, param, query } from 'express-validator';

export const createBlogValidator = [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      'A title of a minimum length of 3 characters and a max of 30 is required',
    ),
  body('content')
    .trim()
    .notEmpty()
    .isLength({ min: 10, max: 500 })
    .withMessage(
      'A title of a minimum length of 10 characters and a max of 500 is required',
    ),
  body('allowDownload')
    .notEmpty()
    .isBoolean()
    .withMessage('allowDownload must be a boolean value (true or false)'),
];

export const validateSlug = param('slug')
  .trim()
  .isLength({ min: 1, max: 200 })
  .withMessage('Slug is too long')
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .withMessage(
    'Slug must contain only lowercase letters, numbers, and single hyphens',
  );

export const editBlogValidation = [validateSlug, ...createBlogValidator];

export const validateBlogsPagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
];
