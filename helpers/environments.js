/*
 * Title: Environments.
 * Description: Handle all environment related things.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "abcdabcdabcd",
  maxChecks: 5,
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "xyzxyzxyz",
  maxChecks: 5,
};

// detetmine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
