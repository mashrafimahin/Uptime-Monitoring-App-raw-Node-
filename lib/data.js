/*
 * Title: Data Operations Handler.
 * Description: All Data Operations Handling Functions.
 * Author: Mashrafi Mahin
 * Date: 16/04/2026
 *
 */

// dependencies
const fs = require("fs");
const path = require("path");

// scaffolding
const data = {};

// base directory for the data creation
data.basedir = path.join(__dirname, "/../.data/");

// write data to database
data.create = (dir, file, fileData, callback) => {
  // open file for writing
  fs.open(`${data.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    // condition - 01
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(fileData);

      // write data
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        // condition - 02
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            // condition - 03
            if (!err3) {
              callback(false);
            } else {
              callback("Error closing the new file.");
            }
          });
        } else {
          callback("Error writing to new file.");
        }
      });
    } else {
      callback(
        "This file already exists in current directory. Sorry, no access to override.",
      );
    }
  });
};

// read data from database
data.read = (dir, file, callback) => {
  fs.readFile(`${data.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// updating existing data
data.update = (dir, file, newData, callback) => {
  // open targeted file
  fs.open(`${data.basedir + dir}/${file}.json`, "r+", (err, fileRef) => {
    // condition - 01
    if (!err && fileRef) {
      // data as string
      const newStringData = JSON.stringify(newData);

      // truncate existing file
      fs.ftruncate(fileRef, (error) => {
        if (!error) {
          // write data to existing file
          fs.writeFile(fileRef, newStringData, (err2) => {
            if (!err2) {
              fs.close(fileRef, (err3) => {
                if (!err3) {
                  callback("Data Updated Successfully!");
                } else {
                  callback("Error on closing file.");
                }
              });
            } else {
              callback("Error on writing new data to existing file.");
            }
          });
        } else {
          callback("Error happens on cleaning older data.");
        }
      });
    } else {
      callback("Error found. File may not exists in targeted directory.");
    }
  });
};

// exports
module.exports = data;
