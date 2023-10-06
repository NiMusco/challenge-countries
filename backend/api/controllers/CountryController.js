/**
 * CountryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    get: async function(req, res) {
        try {
            let params = req.allParams();
    
            const validColumns = ['name', 'capital', 'continents'];
            const criteria = {};
    
            // Filter by valid columns
            for (const column of validColumns) {
                if (params[column]) {
                    criteria[column] = params[column];
                }
            }
    
            const data = await Country.find(criteria);
            return res.json(data);
        } catch (e) {
            sails.log.error("Error fetching countries from DB", e);
            return res.status(503).json({ error: 'An error occurred while fetching countries' });
        }
    },

    id: async function(req, res) {
        try {
            let params = req.allParams();

            if(!params.id){
                return res.status(500).json({ error: 'Missing country id'});
            }

            const criteria = {ccn3: params.id};
            const data = await Country.findOne(criteria);
            return res.json(data);
        } catch (e) {
            sails.log.error("Error fetching country " + params.ccn3 + " from DB", e);
            return res.status(503).json({ error: 'An error occurred while fetching country' });
        }
    },

    repopulate: async function(req, res) {
        const axios = require('axios');
        const requestedFields = ['ccn3', 'name', 'flags', 'capital', 'continents', 'population', 'currencies', 'languages'];
        
        try {
            const fields = requestedFields.join(',');
            const response = await axios.get(`https://restcountries.com/v3.1/all?fields=${fields}`);
            const countriesData = response.data;

            // Drop the collection.
            await Country.destroy({});

            const chunkSize = 1000;
      
            for (let i = 0; i < countriesData.length; i += chunkSize) {
                const chunk = countriesData.slice(i, i + chunkSize);
                
                const countriesToInsert = chunk.map(countryData => ({
                    ccn3: Number(countryData.ccn3),
                    name: countryData.name?.common || 'N/A',
                    capital: Array.isArray(countryData.capital) ? countryData.capital.join(', ') : countryData.capital || 'N/A',
                    continents: Array.isArray(countryData.continents) ? countryData.continents.join(', ') : countryData.continents || 'N/A',
                    population: countryData.population || 0,
                    currencies: countryData.currencies ? Object.keys(countryData.currencies).map((key) => `${countryData.currencies[key].name} (${countryData.currencies[key].symbol})`).join(', ') : 'N/A',
                    languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A',
                    flag: countryData.flags ? countryData.flags.svg : 'N/A'
                }));
            
                // Insert in bulk.
                await Country.createEach(countriesToInsert);
            }
      
            sails.log.debug('Data saved to the database successfully.');
            return res.ok();

        } catch (e) {
            sails.log.error('Error fetching data from the API or saving to the database:', e);
            return res.status(503).json({ error: 'Service temporarily unavailable' });
        }
    }      
};

