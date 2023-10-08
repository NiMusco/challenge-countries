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
    
            // Filter by valid columns with "%LIKE%" search
            for (const column of validColumns) {
                if (params[column]) {
                criteria[column] = { 'contains': params[column] };
                }
            }
    
            const data = await Country.find(criteria).populate("languages");
            return res.json(data);
        } catch (e) {
            sails.log.error("Error fetching countries from DB", e);
            return res.status(503).json({ error: 'An error occurred while fetching countries' });
        }
    },

    id: async function(req, res) {
        var params = req.allParams();
        try {
            if (!params.id) {
                return res.status(500).json({ error: 'Missing country id' });
            }
    
            const criteria = { ccn3: params.id };
            const data = await Country.findOne(criteria).populate('languages');
    
            // Add a delay of 500 milliseconds to showcase loader client-side.
            setTimeout(() => {
                return res.json(data);
            }, 500);
        } catch (e) {
            sails.log.error('Error fetching country ' + params.ccn3 + ' from DB', e);
            return res.status(503).json({ error: 'An error occurred while fetching country' });
        }
    },    

    language: async function (req, res) {
        try {
          const countries = await Country.find().populate('languages');
          const languageCounts = {};
      
          countries.forEach(country => {
            if (country.languages && country.languages.length > 0) {
              country.languages.forEach(language => {
                languageCounts[language.code] = {
                  code: language.code,
                  name: language.name,
                  count: (languageCounts[language.code]?.count || 0) + 1
                };
              });
            }
          });
      
          // Convert the language counts into an array of objects
          const groupedLanguages = Object.values(languageCounts);
      
          // Sort by count in descending order
          groupedLanguages.sort((a, b) => b.count - a.count);
      
          // Limit to the top 20 languages
          const limitedGroupedLanguages = groupedLanguages.slice(0, 20);
      
          return res.json(limitedGroupedLanguages);
        } catch (error) {
          return res.serverError('Error grouping countries by language: ' + error.message);
        }
    },
};
