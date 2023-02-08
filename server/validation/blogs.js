import Joi from "joi";

export const validateCreateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(blog);
};

export const validateUpdateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50),
    description: Joi.string(),
    category: Joi.string(),
  });
  return schema.validate(blog);
};
