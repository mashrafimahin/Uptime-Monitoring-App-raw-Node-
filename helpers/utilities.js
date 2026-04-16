/*
 * Title: Utility Tools.
 * Description: Important utility functions/tools.
 * Author: Mashrafi Mahin
 * Date: 16/04/2026
 *
 */

// dependencies
const crypto = require("crypto");
const environment = require("./environments");

// module scaffolding
const utilities = {};

// json validation (string - object)
utilities.parsedJSON = (jsonString) => {
  let output;

  // handle conditions
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hashing tool for encrypt user password
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

// exports
module.exports = utilities;
