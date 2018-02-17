# Changelog
All notable changes to this project will be documented in this file.

## 0.2.1
##### 2018-02-17

### Added
- Now you can configure the amount of bytes that will be readed from file to get lines.
```
    const readLinesRiched = require("./main").readLines(file_path, {
        bChunk: 1024,
        dir: 1
    });
    var line = await readLinesRiched.readNextLine();
```
- Readed lines cache to avoid multiples read over previously readed bytes.


### Removed
- Test folder from distribution.

