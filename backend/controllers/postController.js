import * as postService from '../services/postService.js';
import { successResponse } from '../utils/responseUtils.js';
import { asyncWrapper } from '../utils/helpers.js';

/**
 * POST /api/posts  (protected)
 * Body: { text?, image? }  — at least one required
 */
export const createPost = asyncWrapper(async (req, res) => {
  const post = await postService.createPost(req.user._id, req.body);
  successResponse(res, 201, 'Post created successfully', { post });
});

/**
 * GET /api/posts  (protected)
 * Returns ALL posts, newest first, with embedded user info
 */
export const getAllPosts = asyncWrapper(async (req, res) => {
  const posts = await postService.getAllPosts();
  successResponse(res, 200, 'Posts retrieved successfully', { posts, count: posts.length });
});

/**
 * GET /api/posts/my  (protected)
 * Returns only the authenticated user's posts
 */
export const getOwnPosts = asyncWrapper(async (req, res) => {
  const posts = await postService.getOwnPosts(req.user._id);
  successResponse(res, 200, 'Your posts retrieved successfully', { posts, count: posts.length });
});

/**
 * DELETE /api/posts/:id  (protected)
 * Deletes a post — only the owner can do this
 */
export const deletePost = asyncWrapper(async (req, res) => {
  const post = await postService.deletePost(req.params.id, req.user._id);
  successResponse(res, 200, 'Post deleted successfully', { post });
});
