/**
 * Middleware to validate request body against a Yup schema.
 * Attaches cleaned (cast + stripped) values back to req.body.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 *
 * @param {import('yup').AnyObjectSchema} schema
 * @param {'body'|'params'|'query'} source - which part of req to validate
 */
const validate = (schema, source = 'body') => async (req, res, next) => {
  try {
    const cleaned = await schema.validate(req[source], {
      abortEarly: false,   // collect all errors at once
      stripUnknown: true,  // remove fields not in schema
    });
    req[source] = cleaned; // replace req.body with sanitized data
    next();
  } catch (err) {
    next(err); // ValidationError is handled by globalErrorHandler
  }
};

export default validate;
