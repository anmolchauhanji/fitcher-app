import { ZodError } from "zod";
import ApiError from "../lib/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // If request is multipart/form-data, some nested fields may arrive as JSON strings.
      // Try to parse any string fields that look like JSON before validation.
      try {
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('multipart/form-data') && req.body && typeof req.body === 'object') {
          for (const key of Object.keys(req.body)) {
            const val = req.body[key];
            if (typeof val === 'string') {
              const trimmed = val.trim();
              if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']')) ) {
                try {
                  req.body[key] = JSON.parse(val);
                } catch (e) {
                  // leave as string if parse fails
                }
              }
            }
          }
        }
      } catch (e) {
        // noop
      }

      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            error.issues.map((issue) => issue.message).join(", ")
          )
        );
      }

      next(error);
    }
  };
};

export default validate;