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
// write data (database style but in local)
const data = require("./lib/data");

// app object - module scaffolding
const app = {};

// testing file system (writing in database(local))
data.create("test", "myFile", { name: "Mashrafi", age: 20 }, (err) => {
  console.log(`error was ${err}`);
});

// read data from database (local)
data.read("test", "myFile", (err, result) => console.log(err, result));

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
