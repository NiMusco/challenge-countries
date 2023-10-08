/**
 * Country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    ccn3: {
      type: 'number',
    },
    name: {
      type: 'string',
      required: true,
    },
    capital: {
      type: 'string',
    },
    continents: {
      type: 'string',
    },
    population: {
      type: 'number',
    },
    currencies: {
      type: 'string',
    },
    flag: {
      type: 'string',
    },
    map: {
      type: 'string',
    },
    latitude: {
      type: 'string', //signed int
    },
    longitude: {
      type: 'string', //signed int
    },
    languages: {
      collection: 'language',
      via: 'countries',
    }
  },

};

