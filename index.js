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

// app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

// create new server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`listening on port ${app.config.port}`);
  });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
