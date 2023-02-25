const { Schema, model } = require('mongoose');
const joi = require('joi');
const { mongooseHandleError } = require('../helpers/mongooseHandleError');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', mongooseHandleError);

const users = model('user', userSchema);

const schemaRegistration = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  subscription: joi.string().valid('starter', 'pro', 'business'),
});

const schemaLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const schemUpdateSubscription = joi.object({
  subscription: joi.string().valid('starter', 'pro', 'business').required(),
});

module.exports = {
  users,
  schemUpdateSubscription,
  schemaRegistration,
  schemaLogin,
};
