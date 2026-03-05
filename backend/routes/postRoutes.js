import { Router } from 'express';
import * as postController from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { createPostSchema } from '../validations/postValidation.js';

const router = Router();

// All post routes require authentication
router.use(protect);

/**
 * @route  GET /api/posts
 * @desc   Get all posts (newest first) with user info
 * @access Private
 */
router.get('/', postController.getAllPosts);

/**
 * @route  GET /api/posts/my
 * @desc   Get only the authenticated user's posts
 * @access Private
 */
router.get('/my', postController.getOwnPosts);

/**
 * @route  POST /api/posts
 * @desc   Create a new post (text and/or image required)
 * @access Private
 */
router.post('/', validate(createPostSchema), postController.createPost);

/**
 * @route  DELETE /api/posts/:id
 * @desc   Delete a post — only the owner can perform this action
 * @access Private
 */
router.delete('/:id', postController.deletePost);

export default router;
