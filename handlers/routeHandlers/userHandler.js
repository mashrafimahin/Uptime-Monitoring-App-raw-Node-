/*
 * Title: User Handler.
 * Description: User Actions Handled Securely.
 * Author: Mashrafi Mahin
 * Date: 16/04/2026
 *
 */

// dependencies
const data = require("../../lib/data");
const { parsedJSON, hash } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

// module - scaffolding
const user = {};
user._users = {}; // private property

// user handle function
user.userHandler = (requestObject, callback) => {
  // methods define inside array
  const acceptedMethods = ["get", "post", "put", "delete"];
  // checking codition
  if (acceptedMethods.indexOf(requestObject.method) > -1) {
    user._users[requestObject.method](requestObject, callback);
  } else {
    callback(405);
  }
};

// methods declaring
user._users.get = (requestObject, callback) => {
  const phone =
    typeof requestObject.queryStringObject.phone === "string" &&
    requestObject.queryStringObject.phone.trim().length === 11
      ? requestObject.queryStringObject.phone
      : false;

  // check if user available
  if (phone) {
    // lookup the expected user
    data.read("users", phone, (err, u) => {
      // valid json parser & copy data from original object
      const user = { ...parsedJSON(u) };
      // if exists
      if (!err && user) {
        // encrypt password
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          message: "Requested User Not Found.",
        });
      }
    });
  } else {
    callback(403, {
      message: "Authentication failed.",
    });
  }
};

user._users.post = (requestObject, callback) => {
  // validation for required information
  const firstName =
    typeof requestObject.body.firstName === "string" &&
    requestObject.body.firstName.trim().length > 0
      ? requestObject.body.firstName
      : false;

  const lastName =
    typeof requestObject.body.lastName === "string" &&
    requestObject.body.lastName.trim().length > 0
      ? requestObject.body.lastName
      : false;

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

  const tosAgree =
    typeof requestObject.body.tosAgree === "boolean" &&
    requestObject.body.tosAgree === true
      ? requestObject.body.tosAgree
      : false;

  // regiter new ueser
  if (firstName && lastName && phone && password && tosAgree) {
    // check for existing user
    data.read("users", phone, (err) => {
      if (err) {
        // make user object
        let userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgree,
        };

        // store data to database (local)
        data.create("users", phone, userObj, (error) => {
          if (!error) {
            callback(200, {
              message: "User created successfully.",
            });
          } else {
            callback(500, {
              Error: "Could not create user.",
            });
          }
        });
      } else {
        // User already exists
        callback(400, {
          message: "User with this phone number already exists.",
        });
      }
    });
  } else {
    callback(400, {
      message: "You have a problem in your request.",
    });
  }
};

user._users.put = (requestObject, callback) => {
  const phone =
    typeof requestObject.body.phone === "string" &&
    requestObject.body.phone.trim().length === 11
      ? requestObject.body.phone
      : false;

  const firstName =
    typeof requestObject.body.firstName === "string" &&
    requestObject.body.firstName.trim().length > 0
      ? requestObject.body.firstName
      : false;

  const lastName =
    typeof requestObject.body.lastName === "string" &&
    requestObject.body.lastName.trim().length > 0
      ? requestObject.body.lastName
      : false;

  const password =
    typeof requestObject.body.password === "string" &&
    requestObject.body.password.trim().length > 0
      ? requestObject.body.password
      : false;

  // check if phone valid
  if (phone) {
    // verification
    let token =
      typeof requestObject.headersObject.token === "string"
        ? requestObject.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        if (firstName || lastName || password) {
          // check if file exists
          data.read("users", phone, (err, u) => {
            const user = { ...parsedJSON(u) };
            // check
            if (!err && user) {
              // edit files name by name
              if (firstName) user.firstName = firstName;
              if (lastName) user.lastName = lastName;
              if (password) user.password = hash(password);
              // save to database
              data.update("users", phone, user, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User data updated successfully!",
                  });
                } else {
                  callback(500, {
                    message: "User data updating failed.",
                  });
                }
              });
            } else {
              callback(400, {
                message: "User doesn't exists.",
              });
            }
          });
        } else {
          callback(400, {
            message: "You have a problem in your request.",
          });
        }
      } else {
        callback(403, {
          message: "Authentication failed.",
        });
      }
    });
  } else {
    callback(404, {
      message: "Invalid phone number. Please try again.",
    });
  }
};

user._users.delete = (requestObject, callback) => {
  const phone =
    typeof requestObject.queryStringObject.phone === "string" &&
    requestObject.queryStringObject.phone.trim().length === 11
      ? requestObject.queryStringObject.phone
      : false;

  // check if validation is passed
  if (phone) {
    // verification
    let token =
      typeof requestObject.headersObject.token === "string"
        ? requestObject.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the expected user
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            // delete file
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, { message: "User deleted successfully!" });
              } else {
                callback(500, { message: "User deletion failed." });
              }
            });
          } else {
            callback(500, { message: "There was a problem in server side." });
          }
        });
      } else {
        callback(403, {
          message: "Authentication failed.",
        });
      }
    });
  } else {
    callback(404, {
      message: "There was a problem in deleting file.",
    });
  }
};

// exports
module.exports = user;
