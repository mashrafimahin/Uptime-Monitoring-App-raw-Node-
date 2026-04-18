/*
 * Title: Check Handler.
 * Description: Check Actions Handled Securely.
 * Author: Mashrafi Mahin
 * Date: 18/04/2026
 *
 */

// dependencies
const data = require("../../lib/data");
const { parsedJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

// module - scaffolding
const handler = {};
handler._check = {}; // private property

// user handle function
handler.checkHandler = (requestObject, callback) => {
  // methods define inside array
  const acceptedMethods = ["get", "post", "put", "delete"];
  // checking codition
  if (acceptedMethods.indexOf(requestObject.method) > -1) {
    handler._check[requestObject.method](requestObject, callback);
  } else {
    callback(405);
  }
};

// methods declaring
handler._check.get = (requestObject, callback) => {
  const id =
    typeof requestObject.queryStringObject.id === "string" &&
    requestObject.queryStringObject.id.trim().length === 20
      ? requestObject.queryStringObject.id
      : false;

  // checking
  if (id) {
    // read data
    data.read("checks", id, (err, cd) => {
      const checkData = parsedJSON(cd);

      // checking if valid
      if (!err && checkData) {
        // auth checking
        const token =
          typeof requestObject.headersObject.token === "string"
            ? requestObject.headersObject.token
            : false;

        // verify token
        tokenHandler._token.verify(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, checkData);
            } else {
              callback(403, { message: "Authentication Failed." });
            }
          },
        );
      } else {
        callback(500, {
          message: "Information not found.",
        });
      }
    });
  } else {
    callback(400, {
      message: "Problem on request.",
    });
  }
};

handler._check.post = (requestObject, callback) => {
  // validate inputs
  let protocol =
    typeof requestObject.body.protocol === "string" &&
    ["http", "https"].indexOf(requestObject.body.protocol) > -1
      ? requestObject.body.protocol
      : false;

  let url =
    typeof requestObject.body.url === "string" &&
    requestObject.body.url.trim().length > 0
      ? requestObject.body.url
      : false;

  let method =
    typeof requestObject.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestObject.body.method) > -1
      ? requestObject.body.method
      : false;

  let successCodes =
    typeof requestObject.body.successCodes === "object" &&
    requestObject.body.successCodes instanceof Array
      ? requestObject.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestObject.body.timeOutSeconds === "number" &&
    requestObject.body.timeOutSeconds % 1 === 0 &&
    requestObject.body.timeOutSeconds >= 1 &&
    requestObject.body.timeOutSeconds <= 5
      ? requestObject.body.timeOutSeconds
      : false;

  // checking
  if (protocol && url && method && successCodes && method) {
    // auth checking
    const token =
      typeof requestObject.headersObject.token === "string"
        ? requestObject.headersObject.token
        : false;

    // get user phone by reading token
    data.read("tokens", token, (err, t) => {
      const tokenData = parsedJSON(t);

      if (!err && tokenData) {
        const userPhone = tokenData.phone;
        // lookup the user data
        data.read("users", userPhone, (err1, ud) => {
          const userData = parsedJSON(ud);
          if (!err1 && userData) {
            // validation
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                // checks
                let userChecks =
                  typeof userData.checks === "object" &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];

                // condition
                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  // save object
                  data.create("checks", checkId, checkObj, (err2) => {
                    if (!err2) {
                      // add checkId to the users object
                      userData.checks = userChecks;
                      userChecks.push(checkId);

                      // save the data to the user object
                      data.update("users", userPhone, userData, (err3) => {
                        if (!err3) {
                          // return a new check
                          callback(200, checkObj);
                        } else {
                          callback(500, {
                            message: "Error on saving data.",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        message: "Server crashed.",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    message: "User has reached max checks.",
                  });
                }
              } else {
                callback(403, {
                  message: "Token is not matched with user.",
                });
              }
            });
          } else {
            callback(403, {
              message: "User data not found.",
            });
          }
        });
      } else {
        callback(403, {
          message: "Authentication problem occured.",
        });
      }
    });
  } else {
    callback(400, {
      message: "Problem in request.",
    });
  }
};

handler._check.put = (requestObject, callback) => {};

handler._check.delete = (requestObject, callback) => {};

// exports
module.exports = handler;
