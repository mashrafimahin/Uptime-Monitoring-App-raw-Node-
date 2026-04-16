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
handler.notFoundHandler = (requestObject, callback) => {
  callback(404, {
    message: "Requested route not found!",
  });
};

// exports
module.exports = handler;
