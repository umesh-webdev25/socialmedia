import * as Yup from 'yup';

/**
 * Schema for PATCH /api/users/profile
 * Email is intentionally excluded — it is read-only.
 */
export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .optional(),

  bio: Yup.string()
    .trim()
    .max(200, 'Bio must not exceed 200 characters')
    .optional(),

  profilePicture: Yup.string()
    .trim()
    .url('Profile picture must be a valid URL')
    .optional()
    .nullable(),
}).test(
  'at-least-one-field',
  'Please provide at least one field to update (name, bio, or profilePicture)',
  (values) => Object.values(values).some((v) => v !== undefined && v !== null && v !== '')
);
