/*
 * Title: Route Control.
 * Description: Routes Controller Functions.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

// app object - module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

// exports
module.exports = routes;
