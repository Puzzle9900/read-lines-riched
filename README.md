# Read Lines Riched

Easy way to read files line by line on two directions: from the beginning to the last and from the last to beginning.

## Installing

```
npm install --save read-lines-riched
```

## Running the tests

```
npm test
```

## Usage

To use the module.
```
const {readLinesStartToEnd, readLinesEndToStart} = require('read-lines-riched');
```

To read lines from the begining of the file to the end.
```
const startToEndRL = readLinesStartToEnd(file_path);
await startToEndRL.readNextLine();
```
To read lines from the end of the file to the beginning.
```
let endToStartRL = readLinesEndToStart(file_path);
await endToStartRL.readNextLine();
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
