import slugify from 'slugify';
import { BlogModel } from '../model/Blog.js';
import PDFDocument from 'pdfkit';

//controller method to let logged in authors create blogs
export const createBlog = async (req, res) => {
  const userId = req.user;
  const { title, content, allowDownload } = req.body;
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
  const newBlog = await BlogModel.create({
    authorId: userId,
    title: title,
    content: content,
    slug: uniqueSlug,
    allowDownload: allowDownload,
  });
  return res.status(201).json(newBlog);
};

//controller method to allow authors to publish the blog
export const postBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  if (userId !== post.authorId.toString()) {
    const error = new Error('User unauthorizedß');
    error.statusCode = 403;
    throw error;
  }
  if (post.status === 'Published') {
    return res.status(200).json({ msg: 'Post alread published' });
  }
  post.status = 'Published';
  await post.save();
  return res.status(200).json({ msg: 'post published', data: post });
};

//allows authors to archive the blogs, i.e set it to unpublished
export const archiveBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  if (userId !== post.authorId.toString()) {
    const error = new Error('User unauthorizedß');
    error.statusCode = 403;
    throw error;
  }
  post.status = 'Unpublished';
  await post.save();
  return res.status(200).json({ msg: 'post published', data: post });
};

//method that allows users and authors to retrieve or view a specific blog
//a specific blog can be receeived by both users and the author
export const getBlog = async (req, res) => {
  const { slug } = req.params;
  const post = await BlogModel.findOne({ slug });
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  return res.status(200).json({ msg: 'blog found', data: post });
};

//method that allows an author to get a list of all the blogs published by them
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

//method that allows users and authors to get a list of all the blogs published in the site implemented along with pagination
export const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const totalBlogs = await BlogModel.countDocuments({ status: 'Published' });
  if (totalBlogs === 0) {
    const error = new Error('No blogs have been published yet');
    error.statusCode = 404;
    throw error;
  }
  const publishedPosts = await BlogModel.find({ status: 'Published' })
    .skip(skip)
    .limit(limit);
  const totalPages = Math.ceil(totalBlogs / limit);
  return res.status(200).json({
    msg: 'blogs retrieved',
    meta: {
      totalBlogs,
      totalPages,
      currentPage: page,
      pageSize: publishedPosts.length,
    },
    data: publishedPosts,
  });
};

//allows authors that have created the blog to edit them
export const editBlog = async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;
  const userId = req.user;
  const blog = await BlogModel.findOne({ slug });
  if (!blog) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  if (userId !== blog.authorId.toString()) {
    const error = new Error('The post doesnot belong to this author');
    error.statusCode = 403;
    throw error;
  }
  blog.title = title;
  blog.content = content;
  blog.save();
  return res.status(200).json({ msg: 'blog updated', data: blog });
};

//allows authors that have created a blog to delete those
export const deleteBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  if (userId !== post.authorId.toString()) {
    const error = new Error('The post doesnot belong to this author');
    error.statusCode = 403;
    throw error;
  }

  const deletedPost = await BlogModel.deleteOne({ slug });
  return res.status(200).json({ msg: 'blog deleted', data: deletedPost });
};

//allows authors to toggle downloadability for blogs written by them
export const toggleDownloadability = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user;
  const post = await BlogModel.findOne({ slug });
  if (!post) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  if (userId !== post.authorId.toString()) {
    const error = new Error('User unauthorizedß');
    error.statusCode = 403;
    throw error;
  }
  post.allowDownload = !post.allowDownload;
  await post.save();
  return res
    .status(200)
    .json({ msg: 'post downloadability changed', data: post });
};

//alllows users to download blogs as pdf to be able to view them or use them offline
export const downloadBlogPDF = async (req, res) => {
  const { slug } = req.params;
  const blog = await BlogModel.findOne({ slug });
  if (!blog) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }

  const isPublished = blog.status;
  if (isPublished !== 'Published') {
    const error = new Error('Blog with this slug has not been published');
    error.statusCode = 403;
    throw error;
  }

  const isDownloadable = blog.allowDownload;
  if (!isDownloadable) {
    const error = new Error(
      'The author has not allowed downloadability for the file',
    );
    error.statusCode = 403;
    throw error;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${blog.slug}.pdf"`,
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(22).text(blog.title, { align: 'left' }).moveDown(1);

  doc
    .fontSize(12)
    .text(`Status: ${blog.status}`)
    .text(`Created: ${blog.createdAt.toDateString()}`)
    .moveDown(1);

  doc.fontSize(14).text(blog.content, {
    align: 'left',
    lineGap: 6,
  });

  doc.end();
};
