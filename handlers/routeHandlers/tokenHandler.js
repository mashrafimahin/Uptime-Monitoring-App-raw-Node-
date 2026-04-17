/*
 * Title: User Handler.
 * Description: User Actions Handled Securely.
 * Author: Mashrafi Mahin
 * Date: 17/04/2026
 *
 */

// dependencies
const data = require("../../lib/data");
const {
  parsedJSON,
  hash,
  createRandomString,
} = require("../../helpers/utilities");

// module - scaffolding
const handler = {};
handler._token = {}; // private property

// user handle function
handler.tokenHandler = (requestObject, callback) => {
  // methods define inside array
  const acceptedMethods = ["get", "post", "put", "delete"];
  // checking codition
  if (acceptedMethods.indexOf(requestObject.method) > -1) {
    handler._token[requestObject.method](requestObject, callback);
  } else {
    callback(405);
  }
};

// methods declaring
handler._token.get = (requestObject, callback) => {};

handler._token.post = (requestObject, callback) => {
  // validation for required information
  const phone =
    typeof requestObject.body.phone === "string" &&
    requestObject.body.phone.trim().length === 11
      ? requestObject.body.phone
      : false;

  const password =
    typeof requestObject.body.password === "string" &&
    requestObject.body.password.trim().length > 0
      ? requestObject.body.password
      : false;

  // checking
  if (phone && password) {
    // read data
    data.read("users", phone, (err1, uD) => {
      const userData = parsedJSON(uD);
      let hashedPass = hash(password);

      if (hashedPass === userData.password) {
        // create token
        let tokenId = createRandomString(20);
        let expires = Date.now() + 3600 * 1000;
        let tokenObject = {
          id: tokenId,
          phone,
          expires,
        };

        // store to database
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              message: "Server Side Crashed.",
            });
          }
        });
      } else {
        callback(400, {
          message: "Password is not valid.",
        });
      }
    });
  } else {
    callback(400, {
      message: "There was an error occured.",
    });
  }
};

handler._token.put = (requestObject, callback) => {};

handler._token.delete = (requestObject, callback) => {};

// exports
module.exports = handler;
