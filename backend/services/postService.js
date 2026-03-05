import Post from '../models/Post.js';
import { createError } from '../helpers/errorHandler.js';
import { isValidObjectId } from '../utils/helpers.js';

/**
 * Create a new post for the authenticated user
 * @param {string} userId
 * @param {{ text?: string, image?: string }} data
 * @returns {object} created post
 */
export const createPost = async (userId, { text, image }) => {
  const post = await Post.create({ text, image, user: userId });
  return post;
};

/**
 * Get all posts (newest first) with embedded user info
 * @returns {Array} posts
 */
export const getAllPosts = async () => {
  const posts = await Post.find().sort({ createdAt: -1 });
  return posts;
};

/**
 * Get all posts belonging to the authenticated user
 * @param {string} userId
 * @returns {Array} posts
 */
export const getOwnPosts = async (userId) => {
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
  return posts;
};

/**
 * Delete a post — only the owner is allowed to delete
 * @param {string} postId
 * @param {string} userId - authenticated user's ID
 * @returns {object} deleted post
 */
export const deletePost = async (postId, userId) => {
  if (!isValidObjectId(postId)) {
    throw createError('Invalid post ID', 400);
  }

  // Find WITHOUT auto-populate so we can compare user field directly
  const post = await Post.findById(postId).populate('user', 'name email');
  if (!post) {
    throw createError('Post not found', 404);
  }

  // Authorization check: only the post owner can delete
  const postOwnerId = post.user._id ? post.user._id.toString() : post.user.toString();
  if (postOwnerId !== userId.toString()) {
    throw createError('You are not authorized to delete this post', 403);
  }

  await Post.findByIdAndDelete(postId);
  return post;
};
