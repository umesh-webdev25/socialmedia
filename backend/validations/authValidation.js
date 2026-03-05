import * as Yup from 'yup';

/**
 * Schema for POST /api/auth/register
 */
export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),

  email: Yup.string()
    .trim()
    .lowercase()
    .email('Please enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters')
    .required('Password is required'),
});

/**
 * Schema for POST /api/auth/login
 */
export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email('Please enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),
});
