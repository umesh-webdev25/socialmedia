import * as Yup from 'yup';

/**
 * Schema for POST /api/posts
 */
export const createPostSchema = Yup.object({
  text: Yup.string()
    .trim()
    .max(1000, 'Post text must not exceed 1000 characters')
    .optional(),

  image: Yup.string()
    .trim()
    .url('Image must be a valid URL')
    .optional()
    .nullable(),
}).test(
  'text-or-image-required',
  'A post must have text or an image (or both)',
  (values) => !!(values.text || values.image)
);
