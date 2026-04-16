/*
 * Title: Route Control.
 * Description: Routes Controller Functions.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

// app object - module scaffolding
const routes = {
  sample: sampleHandler,
};

// exports
module.exports = routes;
