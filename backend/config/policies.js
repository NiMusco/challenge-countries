/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  CountryController: {
    // Allow anyone to access the endpoint of countries.
    'get': true,

    // Only allow authorized host to make this call.
    // (runs the policy in api/policies/isCrawler.js)
    'repopulate': 'isCrawler',
  }
};