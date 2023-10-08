/**
 * Languages.js
 *
 * @description :: A model definition for languages.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
      code: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      },
      countries: {
        collection: 'country',
        via: 'languages',
        dominant: true
      }
    }
};
  