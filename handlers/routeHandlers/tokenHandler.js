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
handler._token.get = (requestObject, callback) => {
  const id =
    typeof requestObject.queryStringObject.id === "string" &&
    requestObject.queryStringObject.id.trim().length === 20
      ? requestObject.queryStringObject.id
      : false;

  // check if token available
  if (id) {
    // lookup the token
    data.read("tokens", id, (err, t) => {
      // valid json parser & copy data from original object
      const token = { ...parsedJSON(t) };
      // if exists
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          message: "Requested token Not Found.",
        });
      }
    });
  } else {
    callback(404, {
      message: "Token not found.",
    });
  }
};

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

handler._token.put = (requestObject, callback) => {
  const id =
    typeof requestObject.body.id === "string" &&
    requestObject.body.id.trim().length === 20
      ? requestObject.body.id
      : false;

  const extend =
    typeof requestObject.body.extend === "boolean" &&
    requestObject.body.extend === true
      ? true
      : false;

  // checking
  if (id && extend) {
    data.read("tokens", id, (err, t) => {
      const tokenData = parsedJSON(t);
      if (tokenData.expires > Date.now()) {
        // modify
        tokenData.expires = Date.now() + 3600 * 1000;
        // update
        data.update("tokens", id, tokenData, (err1) => {
          if (!err1) {
            callback(200);
          } else {
            callback(400, {
              message: "Having problem with saving data.",
            });
          }
        });
      } else {
        callback(400, {
          message: "Token already expired.",
        });
      }
    });
  } else {
    callback(400, {
      message: "Token not found.",
    });
  }
};

handler._token.delete = (requestObject, callback) => {
  const id =
    typeof requestObject.queryStringObject.id === "string" &&
    requestObject.queryStringObject.id.trim().length === 20
      ? requestObject.queryStringObject.id
      : false;

  // check if validation is passed
  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        // delete token
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, { message: "Token deleted successfully!" });
          } else {
            callback(500, { message: "Token deletion failed." });
          }
        });
      } else {
        callback(500, { message: "There was a problem in server side." });
      }
    });
  } else {
    callback(404, {
      message: "There was a problem in deleting token.",
    });
  }
};

// verify token / authentication
handler._token.verify = (id, phone, callback) => {
  // check inside database (local)
  data.read("tokens", id, (err, t) => {
    if (!err) {
      const tokenData = parsedJSON(t);
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// exports
module.exports = handler;
