const axios = require('axios');

module.exports = {
  updateCountries() {
    return new Promise(async function(resolve,reject){
      const requestedFields = ['ccn3', 'name', 'flags', 'capital', 'continents', 'population', 'currencies', 'languages', 'latlng', 'maps'];
        const chunkSize = 1000;  // Size for every bulk chunk

        try {
          const fields = requestedFields.join(',');
          const response = await axios.get(`https://restcountries.com/v3.1/all?fields=${fields}`);
          const countriesData = response.data;
        
          sails.log.info("---------------------------------------");
          sails.log.info("[Countries] Updating database...");

          // Get existing records from the database
          const existingCountries = await Country.find();
            
          let languagesToInsert = [];

            // Iterate through countriesData and extract unique languages
            for (const countryData of countriesData) {
                const countryLanguages = Object.entries(countryData.languages)
                .map(([code, name]) => ({code, name }));

                for (const language of countryLanguages) {
                    if (!languagesToInsert.some((lang) => lang.code === language.code)) {
                        languagesToInsert.push(language);
                    }
                }
            }

            // Create languages and retrieve them for later comparison
            const languages = await Language.createEach(languagesToInsert).fetch();

            const languageMap = {};
            for (const language of languages) {
                languageMap[language.code] = language.id;
            }

            let countriesToInsert = [];
            const processedCountries = [];
            
            // Process countries in chunks
            for (let i = 0; i < countriesData.length; i += chunkSize) {
              const chunk = countriesData.slice(i, i + chunkSize);

              for (const countryData of chunk) {
                const existingCountry = existingCountries.find(country => {
                  return country.ccn3 === Number(countryData.ccn3);
                });
      
                if (existingCountry) {
                  // Update the existing record
                  await Country.updateOne({ id: existingCountry.id }).set(formatCountryData(countryData, languageMap));
                  processedCountries.push(existingCountry.ccn3);
                } else {
                  // Create new records for countries not already in the database
                  countriesToInsert.push(formatCountryData(countryData, languageMap));
                }
              }
            }
            
            // Delete records that were not updated (no longer in the JSON)
            const countriesToDelete = existingCountries.filter(country => !processedCountries.includes(country.ccn3));

            for (const countryToDelete of countriesToDelete) {
                await Country.destroy({ id: countryToDelete.id });
            }

            // Create new records for countries not already in the database
            countriesToInsert = countriesData
                .filter(countryData => {
                    return !existingCountries.some(existingCountry => existingCountry.ccn3 === Number(countryData.ccn3));
                })
                .map(countryData => (formatCountryData(countryData, languageMap)));


            // Insert new records in bulk
            await Country.createEach(countriesToInsert);

            sails.log.info("[Countries] " + processedCountries.length + " updated.");
            sails.log.info("[Countries] " + countriesToDelete.length + " deleted.");
            sails.log.info("[Countries] " + countriesToInsert.length + " created.");
            sails.log.info("[Countries] Database is now up to date.");
            sails.log.info("---------------------------------------");

            return resolve();
            
        } catch (e) {
          return reject(e);
        }
    })
  }
};

function formatCountryData(countryData, languageMap){

  return {
      ccn3: Number(countryData.ccn3),
      name: countryData.name?.common || 'N/A',
      capital: Array.isArray(countryData.capital) ? countryData.capital.join(', ') : countryData.capital || 'N/A',
      continents: Array.isArray(countryData.continents) ? countryData.continents.join(', ') : countryData.continents || 'N/A',
      population: countryData.population || 0,
      currencies: countryData.currencies ? Object.keys(countryData.currencies).map((key) => `${countryData.currencies[key].name} (${countryData.currencies[key].symbol})`).join(', ') : 'N/A',
      flag: countryData.flags ? countryData.flags.svg : 'N/A',
      latitude: countryData.latlng ? countryData.latlng[0] : null,
      longitude: countryData.latlng ? countryData.latlng[1] : null,
      map: countryData.maps?.googleMaps ? countryData.maps.googleMaps : null,
      languages: Object.keys(countryData.languages).map(language => languageMap[language]),
  }
}