const { Schema, model } = require('mongoose');
const joi = require('joi');

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
  },
  { versionKey: false, timestamps: true }
);

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
