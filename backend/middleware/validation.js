import Joi from 'joi';

export const validateDriver = Joi.object({
  firstName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  currentLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  })
});

export const validatePickup = Joi.object({
  address: Joi.string().required(),
  scheduledTime: Joi.date().min('now').required()
});