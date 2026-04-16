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
    callback(404, {
      message: "Requested User Not Found.",
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

  // check condition for next step (adding new user)
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

user._users.put = (requestObject, callback) => {};
user._users.delete = (requestObject, callback) => {};

// exports
module.exports = user;
