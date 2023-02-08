import Joi from "joi";

export const validateResetPassword = (user) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate(user);
};

export const validateResetName = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(user);
};

export const validateForgetPassword = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .lowercase()
      .required(),
  });
  return schema.validate(user);
};

export const validateResetForgotPassword = (user) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate(user);
};
