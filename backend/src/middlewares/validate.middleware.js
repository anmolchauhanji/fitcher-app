import { ZodError } from "zod";
import ApiError from "../lib/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
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