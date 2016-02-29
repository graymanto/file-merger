"use strict";

const fs = require('fs');
const glob = require("glob");
const each = require("promise-each");

function sortByPostfixNumber(a, b) {
  let partsa = a.split("_");
  let numbera = parseInt(partsa.pop());

  let partsb = b.split("_");
  let numberb = parseInt(partsb.pop());

  if (numbera > numberb) {
    return 1;
  }

  if (numberb > numbera) {
    return -1;
  }

  return 0;
}

function readFile(file) {
  return new Promise((fulfill, reject) => {
    const callback = (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      fulfill(result);
    };
    fs.readFile(file, callback);
  });
}

function getFilesFromGlob(globString) {
  return new Promise((fulfill, reject) => {
    glob(globString, (err, files) => {
      if (err) {
        reject(err);
      }
      fulfill(files);
    });
  });
}

function mergeFiles(config) {
  if (!config) {
    throw new Error('Configuration for file merge must be passed in.');
  }
  if (!config.mergedFilePath) {
    throw new Error('Path to merged file must be specified');
  }
  if (config.fileList && !Array.isArray(config.fileList)) {
    throw new Error('File list must be an array of files');
  }
  if (!config.fileList && !config.fileGlob) {
    throw new Error('Either a list of files or a file location glob must be specified.');
  }

  const outputFile = fs.createWriteStream(config.mergedFilePath);

  const getFiles = config.fileList ? Promise.resolve(config.fileList) : getFilesFromGlob(config.fileGlob);

  return getFiles
    .then(files => config.sort ? files.concat().sort(config.sort) : files)
    .then(each(file => {
      return readFile(file)
        .then((contents) => {
          outputFile.write(contents);
        })
        .catch(console.error);
    }))
    .then(() => outputFile.end());
}

module.exports = {
  mergeFiles: mergeFiles,
  sortByPostfixNumber: sortByPostfixNumber
};
