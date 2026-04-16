/*
 * Title: Handle Request Response
 * Description: Handle Request & Response Operations.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const { parsedJSON } = require("./utilities");

// app object - module scaffolding
const handler = {};

// handle Request Response
handler.handleReqRes = (req, res) => {
  // get url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedUrl = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase(); // convention
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  // new string decoder
  const decoder = new StringDecoder("utf-8");

  // inital empty variable
  let realData = "";

  // pack all essential data into object
  const requestObject = {
    parsedUrl,
    path,
    trimmedUrl,
    method,
    queryStringObject,
    headersObject,
  };

  // choosen routes
  const choosenRoute = routes[trimmedUrl]
    ? routes[trimmedUrl]
    : notFoundHandler;

  // decoder on request
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  // when decode ends
  req.on("end", () => {
    realData += decoder.end();

    // add realData to main object (requestObject)
    requestObject.body = parsedJSON(realData);

    // handle choosen routes
    choosenRoute(requestObject, (statusCode, payload) => {
      // condition
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      // JSON String
      const payloadString = JSON.stringify(payload);

      // return response
      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

// exports
module.exports = handler;
