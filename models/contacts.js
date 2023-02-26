const { Schema, model } = require('mongoose');
const joi = require('joi');
const { mongooseHandleError } = require('../helpers/mongooseHandleError');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', mongooseHandleError);

const schemaFullData = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  favorite: joi.boolean(),
});

const schemaFavorite = joi.object({
  favorite: joi.boolean().required(),
});

const contacts = model('contact', contactSchema);

module.exports = {
  schemaFullData,
  schemaFavorite,
  contacts,
};
