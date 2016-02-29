"use strict";

const os = require('os');

const fs = require('fs');
const path = require('path');
const checksum = require('checksum');

const testDir = 'spec/files';
const fileSuffixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const filePrefix = 'testfile_';
const fullFileName = 'testfile.txt';
const fullFilePath = path.join(testDir, fullFileName);

const tempDir = os.tmpdir();
const mergedFilePath = path.join(tempDir, fullFileName);

const fm = require('../index');

function getFileCheckSum(filePath) {
  return new Promise((fulfill, reject) => {
    checksum.file(filePath, function(err, sum) {
      if (err) {
        reject(err);
      } else {
        fulfill(sum);
      }
    });
  });
}

describe('Merge files', () => {
  beforeEach((done) => {
    fs.unlink(mergedFilePath, () => {
      done();
    });
  });

  describe('Checks merging of files', () => {
    it('Merges several files from a file list', (done) => {
      const config = {
        fileList: fileSuffixes.map(s => path.join(testDir, `${filePrefix}${s}`)),
        mergedFilePath: mergedFilePath
      };

      fm.mergeFiles(config)
        .then(() => {
          const getFullFileCheckSum = getFileCheckSum(fullFilePath);
          const getMergedFileCheckSum = getFileCheckSum(mergedFilePath);
          return Promise.all([getFullFileCheckSum, getMergedFileCheckSum]);
        })
        .then(checkSums => {
          expect(checkSums[0]).toEqual(checkSums[1]);
          done();
        })
        .catch(err => {
          try {
            done.fail(err);
          } catch (err) {}
          done();
        });
    });
  });
});
