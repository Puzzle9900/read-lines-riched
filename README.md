# What is this?

Easy way to read file lines async and efficiently on two directions: from the beginning to the end and from the end to the beginning.

# Installing

```
npm install --save read-lines-riched
```

# Run tests

```
npm test
```

# Highlights of functionality
* `readLines(file_path[,options])` - Return instance of `readLineRiched` configured with options to read file lines.
    * `options` Object (Optional)
        * `bChunk` Integer - Size in bytes of how many bytes are readed from file at the same time. Default is 1024.
        * `dir` Integer - 1 read lines from beginning to the end. -1 read lines from the end to the beginning. Default is 1.

* `readLinesStartToEnd(file_path)` - Return instance of `readLineRiched` that read from the beginning of the file to the end reading chunks of 1kb.

* `readLinesEndToStart(file_path)` - Return instance of `readLineRiched` that read from the end of the file to the beginning  reading chunks of 1kb.

* `readLineRiched.readNextLine()` - Read next line of file based on given configuration.

# Usage

## Reading from beginning to end using Promise
```
const readLinesEndToStart = require("read-lines-riched").readLinesEndToStart(file_path);

var func = function () {
    readLinesEndToStart.readNextLine().then(line => {
        if (line) {
            console.log(line);
            func()
        } else
            readLinesEndToStart.closeReader();
    });
};
func();
```
## Reading from end to beginning using Async
```
const readLinesStartToEnd = require("read-lines-riched").readLinesStartToEnd(file_path);

(async function () {
    var line;
    while (line = await readLinesStartToEnd.readNextLine()) {
        console.log(line);
    }
    readLinesStartToEnd.closeReader();
})();
```
## Reading from end to beginning on chunks of 4kb.
```
const readLinesRiched = require("read-lines-riched").readLines(file_path, {
        bChunk: 1024 * 4,
        dir: -1
    });

(async function () {
    var line;
    while (line = await readLinesRiched.readNextLine()) {
        console.log(line);
    }
    readLinesRiched.closeReader();
})();
```

# Changelog
All notable changes to this project can be seen [here](https://github.com/Puzzle9900/read-lines-riched/blob/master/CHANGELOG.md).

# Contributing

1. Fork it on Github [https://github.com/Puzzle9900/read-lines-riched](https://github.com/Puzzle9900/read-lines-riched)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

Copyright (c) 2018 [Puzzle9900](https://github.com/Puzzle9900)
