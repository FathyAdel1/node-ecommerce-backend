import Joi from "joi";

export const validateCreateProduct = (product) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(500).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    brand: Joi.string().required(),
    color: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(product);
};

export const validateUpdateProduct = (product) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(3).max(500),
    price: Joi.number(),
    quantity: Joi.number(),
    brand: Joi.string(),
    color: Joi.string(),
    category: Joi.string(),
  });
  return schema.validate(product);
};

export const validateAddRating = (product) => {
  const schema = Joi.object({
    star: Joi.number().required(),
    comment: Joi.string().required(),
  });
  return schema.validate(product);
};
