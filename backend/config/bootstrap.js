/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility? You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const CountryService = require('../api/services/CountryService');
const cron = require('node-cron');

module.exports.bootstrap = async function() {

  try {

    sails.log.info('          ________');
    sails.log.info('      ,o88~~88888888o,');
    sails.log.info('     ,~~?8P  88888     8,');
    sails.log.info('    d  d88 d88 d8_88     b');
    sails.log.info('   d  d888888888          b');
    sails.log.info('   8,?88888888  d8.b o.   8');
    sails.log.info('   8~88888888~ ~^8888\\ db 8');
    sails.log.info('   ?  888888          ,888P');
    sails.log.info('    ?  \`8888b,_      d888P');
    sails.log.info('     \`   8888888b   ,888"');
    sails.log.info('        ~-?8888888 _.P-~');
    sails.log.info('            ~~~~~~');

    //Run on start.
    await CountryService.updateCountries();

    // Schedule the update every 24 hours (at 00:00 AM)
    // debug hint: Change '0 0 * * *' to '*/20 * * * * *' to test it every 20 seconds.
    cron.schedule('*/20 * * * * *', async () => {
      sails.log.info('Cron job started...');
      const result = await CountryService.updateCountries();
    });

  } catch (error) {
    sails.log.error('Error seeding data:', error);
  }
};
