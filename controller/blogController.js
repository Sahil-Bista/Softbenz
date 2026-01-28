import slugify from 'slugify';
import { BlogModel } from '../model/Blog.js';

export const createBlog = async (req, res) => {
  const userId = req.user;
  const { title, content } = req.body;
  const authorContent = await BlogModel.findOne({
    authorId: userId,
    title: title,
    content: content,
  });
  if (authorContent) {
    const error = new Error(
      'The same content has already been written by you as an author, rather edit than creating a new one',
    );
    error.statusCode = 409;
    throw error;
  }

  let baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await BlogModel.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  console.log(uniqueSlug);

  const newBlog = await BlogModel.create({
    authorId: userId,
    title: title,
    content: content,
    slug: uniqueSlug,
  });

  return res.status(201).json(newBlog);
};

export const postBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (userId !== post._id) {
    const error = new Error('User unauthorizedß');
    error.statusCode = 401;
    throw error;
  }
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  post.status = 'Published';
  await post.save();
  return res.status(200).json({ msg: 'post published', data: post });
};

export const getBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (userId !== post._id) {
    const error = new Error('The post doesnot belong to this author');
    error.statusCode = 401;
    throw error;
  }
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  return res.status(200).json({ msg: 'blog found', data: post });
};

export const getAllAuthorBlogs = async (req, res) => {
  const userId = req.user;
  const post = await BlogModel.find({ authorId: userId });
  if (post.length <= 0) {
    const error = new Error('No any blogs written by the author yet');
    error.statusCode = 404;
    throw error;
  }
  return res.status(200).json({ msg: 'blog found', data: post });
};
