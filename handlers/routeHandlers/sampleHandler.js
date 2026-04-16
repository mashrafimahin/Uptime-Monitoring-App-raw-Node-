/*
 * Title: Sample Handlers.
 * Description: Sample Handler Functions.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// module scaffolding
const handler = {};

// sample function
handler.sampleHandler = (requestObject, callback) => {
  console.log(requestObject);
  callback(200, {
    message: "Route availability is okay.",
  });
};

// exports
module.exports = handler;
