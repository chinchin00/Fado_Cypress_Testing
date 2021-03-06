/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const fs = require("fs-extra");
const path = require("path");

function getConfigurationByEnvName(envName) {
  const pathToConfigFile = path.resolve(
    "cypress/config-files",
    `${envName}.json`
  );

  console.log(pathToConfigFile);

  return fs.readJson(pathToConfigFile);
}

const {GoogleSocialLogin, FacebookSocialLogin} = require('cypress-social-logins').plugins

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    GoogleSocialLogin: GoogleSocialLogin,
    FacebookSocialLogin: FacebookSocialLogin
  });

  const envName = config.env.ENV_NAME || "production";

  return getConfigurationByEnvName(envName);
};
