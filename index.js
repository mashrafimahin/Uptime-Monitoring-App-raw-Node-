/*
 * Title: Uptime Monitoring Application.
 * Description: A RESTful API to minitor up/down time of user defined links.
 * Author: Mashrafi Mahin
 * Date: 15/04/2026
 *
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
// environment
const environent = require("./helpers/environments");

// app object - module scaffolding
const app = {};

// create new server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environent.port, () => {
    console.log(`listening on port ${environent.port}`);
  });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
