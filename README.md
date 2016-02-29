# File merger

Simple file merger that combines a set of files into a single file.

The list of files can either be passed in explicity in an array or as a file system glob with an optional sort function.

## Installation

```sh
npm install --save file-mergery
```

## Usage
```javascript
var fm = require('file-mergery')

const config = {
  fileList: ['file1.txt', 'file2.txt'],
  mergedFilePath: 'completeFile.txt'
};

const config2 = {
  fileGlob: '*.mp4*',
  sort: fm.sortByPostfixNumber,
  mergedFilePath: 'completeVideo.mp4'
};

fm.mergeFiles(config)
  .then(() => {
    // Do something with merged file
  })

fm.mergeFiles(config2)
  .then(() => {
    // Do something with merged file
  })

```

## Testing

```sh
npm test
```
